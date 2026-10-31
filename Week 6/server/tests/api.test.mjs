import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { SignJWT } from 'jose';
import { createApiServer } from '../src/app.mjs';
import { openStore } from '../src/store.mjs';
const secret = 'hanya-test-otomatis-tidak-untuk-deployment-123456789';
async function fixture(t, extras = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'money-track-test-')); const dataFile = join(dir, 'db.json');
  const app = await createApiServer({ dataFile, secret, ...extras });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${app.server.address().port}/api`;
  t.after(async () => { await new Promise(resolve => { app.server.close(resolve); app.server.closeAllConnections(); }); await rm(dir, { recursive: true, force: true }); });
  async function call(path, { token, method = 'GET', body, headers = {} } = {}) {
    const response = await fetch(`${base}${path}`, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json', ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: response.status, body: await response.json() };
  }
  async function register(email = 'mahasiswa@example.test') { return call('/auth/register', { method: 'POST', body: { name: 'Mahasiswa Uji', email, password: 'Latihan123!' } }); }
  return { ...app, call, register, dataFile };
}
const transaction = { title: 'Makan siang', type: 'expense', amount_rupiah: 25000, category: 'Makan', transaction_date: '2026-10-27' };
test('register/login benar, credential salah dan input kosong, logout mencabut token', async t => {
  const f = await fixture(t); const account = await f.register(); assert.equal(account.status, 201); const token = account.body.access_token;
  assert.equal((await f.call('/auth/me', { token })).status, 200);
  const ok = await f.call('/auth/login', { method: 'POST', body: { email: 'mahasiswa@example.test', password: 'Latihan123!' } }); assert.equal(ok.status, 200);
  assert.equal((await f.call('/auth/login', { method: 'POST', body: { email: 'mahasiswa@example.test', password: 'PasswordSalah' } })).status, 401);
  assert.equal((await f.call('/auth/login', { method: 'POST', body: {} })).status, 400);
  assert.equal((await f.register()).status, 409);
  assert.equal((await f.call('/auth/logout', { token, method: 'POST' })).status, 200);
  assert.equal((await f.call('/auth/me', { token })).status, 401);
  assert.equal((await f.call('/auth/me', { token: ok.body.access_token })).status, 200);
});
test('data dilindungi per akun, CRUD dan anggaran bertahan di file', async t => {
  const f = await fixture(t); const a = (await f.register('a@example.test')).body.access_token; const b = (await f.register('b@example.test')).body.access_token;
  assert.equal((await f.call('/transactions?month=2026-10')).status, 401);
  const created = await f.call('/transactions', { token: a, method: 'POST', body: transaction }); assert.equal(created.status, 201); const id = created.body.data.id;
  assert.equal('user_id' in created.body.data, false);
  assert.equal((await f.call('/transactions?month=2026-10', { token: b })).body.data.length, 0);
  assert.equal((await f.call(`/transactions/${id}`, { token: b, method: 'PATCH', body: transaction })).status, 404);
  assert.equal((await f.call(`/transactions/${id}`, { token: b, method: 'DELETE' })).status, 404);
  assert.equal((await f.call(`/transactions/${id}`, { token: a, method: 'PATCH', body: { ...transaction, amount_rupiah: 30000 } })).status, 200);
  assert.equal((await f.call('/transactions?month=2026-10', { token: a })).body.data[0].amount_rupiah, 30000);
  assert.equal((await f.call('/transactions?month=2026-11', { token: a })).body.data.length, 0);
  assert.equal((await f.call('/budget', { token: a, method: 'PUT', body: { month: '2026-10', amount_rupiah: 1500000 } })).status, 200);
  assert.equal((await f.call('/budget?month=2026-10', { token: a })).body.amount_rupiah, 1500000);
  assert.equal((await f.call('/budget?month=2026-10', { token: b })).body.amount_rupiah, 0);
  const reloaded = await openStore(f.dataFile); assert.equal(reloaded.read().transactions[0].amount_rupiah, 30000);
  const raw = await readFile(f.dataFile, 'utf8'); assert.equal(raw.includes('Latihan123!'), false); assert.ok(reloaded.read().users[0].password_hash.includes(':'));
  assert.equal((await f.call(`/transactions/${id}`, { token: a, method: 'DELETE' })).status, 200);
});
test('token diubah, kedaluwarsa, dan tanpa sesi aktif ditolak', async t => {
  const f = await fixture(t); const registration = (await f.register()).body; const token = registration.access_token;
  const parts = token.split('.'); parts[1] = Buffer.from(JSON.stringify({ sub: 'attacker' })).toString('base64url');
  assert.equal((await f.call('/auth/me', { token: parts.join('.') })).status, 401);
  const key = new TextEncoder().encode(secret);
  const tokenFor = async (exp, jti) => new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(registration.user.id).setIssuer('money-track-api').setAudience('money-track-mobile').setJti(jti).setExpirationTime(exp).sign(key);
  const session = f.store.read().sessions[0];
  assert.equal((await f.call('/auth/me', { token: await tokenFor(Math.floor(Date.now() / 1000) - 60, session.jti) })).status, 401);
  assert.equal((await f.call('/auth/me', { token: await tokenFor(Math.floor(Date.now() / 1000) + 60, 'session-tidak-ada') })).status, 401);
});
test('validasi backend menolak nominal, tanggal, bulan, dan budget yang tidak valid', async t => {
  const f = await fixture(t); const token = (await f.register()).body.access_token;
  for (const patch of [{ amount_rupiah: -1 }, { amount_rupiah: 1.5 }, { transaction_date: '2026-02-30' }, { type: 'bad' }]) assert.equal((await f.call('/transactions', { token, method: 'POST', body: { ...transaction, ...patch } })).status, 400);
  assert.equal((await f.call('/transactions?month=2026-13', { token })).status, 400);
  assert.equal((await f.call('/budget', { token, method: 'PUT', body: { month: '2026-10', amount_rupiah: -100 } })).status, 400);
});
test('permintaan serentak tidak kehilangan data dan idempotency mencegah transaksi ganda', async t => {
  const f = await fixture(t); const token = (await f.register()).body.access_token;
  const options = { token, method: 'POST', body: transaction, headers: { 'Idempotency-Key': 'request-tetap-1' } };
  const [first, again] = await Promise.all([f.call('/transactions', options), f.call('/transactions', options)]);
  assert.equal(first.body.data.id, again.body.data.id); assert.equal((await f.call('/transactions?month=2026-10', { token })).body.data.length, 1);
  assert.equal((await f.call('/transactions', { ...options, body: { ...transaction, amount_rupiah: 2 } })).status, 409);
  await Promise.all([1, 2, 3].map(n => f.call('/transactions', { token, method: 'POST', body: { ...transaction, title: `Transaksi ${n}` } })));
  assert.equal((await f.call('/transactions?month=2026-10', { token })).body.data.length, 4);
});
test('skenario Week 6 menghasilkan 4xx, 5xx dan empty dengan proteksi token', async t => {
  const f = await fixture(t, { enableTestScenarios: true }); const token = (await f.register()).body.access_token;
  for (const [scenario, expected] of [['client-error', 400], ['forbidden', 403], ['not-found', 404], ['server-error', 503]]) assert.equal((await f.call(`/transactions?month=2026-10&scenario=${scenario}`, { token })).status, expected);
  assert.deepEqual((await f.call('/transactions?month=2026-10&scenario=empty', { token })).body.data, []);
});
