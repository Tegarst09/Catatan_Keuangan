import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { openStore } from './store.mjs';
import { createAuth, publicUser, hashPassword, verifyPassword } from './auth.mjs';
import { validateCredentials } from '../../mobile/src/weeks/week03/task03-security-validation.js';
import { validateTransaction, transactionToDTO, validMonth } from '../../mobile/src/weeks/week04/task01-data-model.js';
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
async function readBody(req) {
  let value = ''; let size = 0;
  for await (const chunk of req) {
    size += chunk.length; if (size > 16384) throw new HttpError(413, 'Data terlalu besar.');
    value += chunk;
  }
  try { const result = JSON.parse(value || '{}'); if (!result || Array.isArray(result) || typeof result !== 'object') throw new Error(); return result; }
  catch { throw new HttpError(400, 'Body harus berupa objek JSON.'); }
}
const dto = row => { const { user_id, request_key, ...safe } = row; return safe; };
const checkedMonth = value => { if (!validMonth(value)) throw new HttpError(400, 'Bulan harus valid dengan format YYYY-MM.'); return value; };
export async function createApiServer({ dataFile, secret, ttlSeconds = 1800, corsOrigins = [], enableTestScenarios = false } = {}) {
  const store = await openStore(dataFile); const auth = createAuth(store, secret, ttlSeconds); const attempts = new Map();
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, body) => { if (!res.destroyed) { res.writeHead(status); res.end(JSON.stringify(body)); } };
    try {
      const origin = req.headers.origin;
      if (origin) {
        if (!corsOrigins.includes(origin)) throw new HttpError(403, 'Origin tidak diizinkan.');
        res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin');
      }
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
      if (req.method === 'OPTIONS') return send(200, { ok: true });
      const url = new URL(req.url, 'http://api.local'); const path = url.pathname.replace(/\/$/, '');
      if (path === '/api/health' && req.method === 'GET') return send(200, { ok: true, service: 'money-track-api' });
      if (['/api/auth/register', '/api/auth/login'].includes(path) && req.method === 'POST') {
        const ip = req.socket.remoteAddress; const now = Date.now();
        const recent = (attempts.get(ip) || []).filter(x => now - x < 60_000);
        if (recent.length >= 15) throw new HttpError(429, 'Terlalu banyak percobaan. Tunggu satu menit.');
        attempts.set(ip, [...recent, now]);
        if (attempts.size > 1000) for (const [k, v] of attempts) if (v.every(x => now - x >= 60_000)) attempts.delete(k);
        const body = await readBody(req); const registering = path.endsWith('/register');
        const { email, password, name } = body;
        if (typeof email !== 'string' || typeof password !== 'string' || (registering && typeof name !== 'string')) throw new HttpError(400, 'Lengkapi email, password, dan nama bila mendaftar.');
        const error = validateCredentials({ email, password, name, confirmPassword: password }, registering);
        if (error) throw new HttpError(400, error);
        const normalized = email.trim().toLowerCase(); let user;
        if (registering) {
          const password_hash = await hashPassword(password);
          user = await store.mutate(db => {
            if (db.users.some(u => u.email === normalized)) throw new HttpError(409, 'Email telah digunakan.');
            const row = { id: randomUUID(), email: normalized, name: name.trim(), password_hash };
            db.users.push(row); return row;
          });
        } else {
          user = store.read().users.find(u => u.email === normalized);
          const valid = await verifyPassword(password, user?.password_hash);
          if (!valid || !user) throw new HttpError(401, 'Email atau password tidak sesuai.');
        }
        return send(registering ? 201 : 200, await auth.issue(user));
      }
      const identity = await auth.verify(req.headers.authorization);
      if (!identity) throw new HttpError(401, 'Sesi tidak valid atau telah berakhir.');
      const userId = identity.user.id;
      if (path === '/api/auth/me' && req.method === 'GET') return send(200, { user: publicUser(identity.user), expires_at: new Date(identity.session.exp * 1000).toISOString() });
      if (path === '/api/auth/logout' && req.method === 'POST') { await auth.revoke(identity.session.jti); return send(200, { ok: true }); }
      if (path === '/api/transactions' && req.method === 'GET') {
        const month = checkedMonth(url.searchParams.get('month'));
        if (enableTestScenarios) {
          const scenario = url.searchParams.get('scenario');
          const statuses = { 'client-error': 400, forbidden: 403, 'not-found': 404, 'server-error': 503 };
          if (statuses[scenario]) throw new HttpError(statuses[scenario], 'Skenario pengujian Week 6.');
          if (scenario === 'timeout') await new Promise(resolve => setTimeout(resolve, 10_000));
          if (scenario === 'empty') return send(200, { data: [] });
        }
        const rows = store.read().transactions.filter(t => t.user_id === userId && t.transaction_date.startsWith(month));
        rows.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date) || b.created_at.localeCompare(a.created_at));
        return send(200, { data: rows.map(dto) });
      }
      const match = path.match(/^\/api\/transactions\/([a-f0-9-]+)$/);
      if ((path === '/api/transactions' && req.method === 'POST') || (match && req.method === 'PATCH')) {
        const body = await readBody(req);
        const model = { title: body.title, type: body.type, amount: body.amount_rupiah, category: body.category, date: body.transaction_date };
        const error = validateTransaction(model); if (error) throw new HttpError(400, error);
        const row = await store.mutate(db => {
          let item;
          if (match) {
            item = db.transactions.find(t => t.id === match[1] && t.user_id === userId);
            if (!item) throw new HttpError(404, 'Transaksi tidak ditemukan.');
          } else {
            const requestKey = req.headers['idempotency-key'];
            if (requestKey && (typeof requestKey !== 'string' || requestKey.length > 100)) throw new HttpError(400, 'Kunci permintaan tidak valid.');
            const existing = requestKey && db.transactions.find(t => t.user_id === userId && t.request_key === requestKey);
            if (existing) {
              const expected = transactionToDTO(model);
              if (!Object.entries(expected).every(([k, v]) => existing[k] === v)) throw new HttpError(409, 'Kunci permintaan sudah digunakan untuk data lain.');
              return dto(existing);
            }
            item = { id: randomUUID(), user_id: userId, created_at: new Date().toISOString(), ...(requestKey ? { request_key: requestKey } : {}) }; db.transactions.push(item);
          }
          Object.assign(item, transactionToDTO(model), { updated_at: new Date().toISOString() }); return dto(item);
        });
        return send(match ? 200 : 201, { data: row });
      }
      if (match && req.method === 'DELETE') {
        await store.mutate(db => {
          const index = db.transactions.findIndex(t => t.id === match[1] && t.user_id === userId);
          if (index < 0) throw new HttpError(404, 'Transaksi tidak ditemukan.'); db.transactions.splice(index, 1);
        }); return send(200, { ok: true });
      }
      if (path === '/api/budget' && req.method === 'GET') {
        const month = checkedMonth(url.searchParams.get('month'));
        const row = store.read().budgets.find(b => b.user_id === userId && b.month === month);
        return send(200, { month, amount_rupiah: row?.amount_rupiah || 0 });
      }
      if (path === '/api/budget' && req.method === 'PUT') {
        const body = await readBody(req); const month = checkedMonth(body.month);
        if (!Number.isSafeInteger(body.amount_rupiah) || body.amount_rupiah < 0 || body.amount_rupiah > 1_000_000_000) throw new HttpError(400, 'Anggaran harus berupa rupiah bulat antara 0 dan 1.000.000.000.');
        await store.mutate(db => {
          let item = db.budgets.find(b => b.user_id === userId && b.month === month);
          if (!item) { item = { user_id: userId, month }; db.budgets.push(item); }
          item.amount_rupiah = body.amount_rupiah;
        }); return send(200, { month, amount_rupiah: body.amount_rupiah });
      }
      throw new HttpError(404, 'Endpoint tidak ditemukan.');
    } catch (e) { send(e.status || 500, { message: e.status ? e.message : 'Terjadi kesalahan pada server.' }); }
  });
  server.requestTimeout = 15_000; server.headersTimeout = 16_000;
  return { server, store, auth };
}
