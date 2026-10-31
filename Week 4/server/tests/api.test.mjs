import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApiServer } from '../src/app.mjs';
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'moneytrack-week4-'));
  const { server } = await createApiServer({ dataFile: join(dir, 'db.json'), corsOrigins: ['http://localhost:8081'] });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api`;
  t.after(async () => { await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }); await rm(dir, { recursive: true, force: true }); });
  return async (path, method = 'GET', body) => {
    const r = await fetch(url + path, { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: r.status, data: await r.json() };
  };
}
const tx = { title: 'Makan contoh', type: 'expense', amount_rupiah: 25000, category: 'Makan', transaction_date: '2026-10-27' };
test('REST API contoh: health, GET, POST, PATCH, DELETE dan filter bulan', async t => {
  const api = await fixture(t); assert.equal((await api('/health')).data.ok, true);
  assert.deepEqual((await api('/transactions?month=2026-10')).data.data, []);
  const made = await api('/transactions', 'POST', tx); assert.equal(made.status, 201); const id = made.data.data.id;
  assert.equal('user_id' in made.data.data, false); assert.equal((await api('/transactions?month=2026-10')).data.data.length, 1); assert.equal((await api('/transactions?month=2026-11')).data.data.length, 0);
  assert.equal((await api(`/transactions/${id}`, 'PATCH', { ...tx, amount_rupiah: 30000 })).data.data.amount_rupiah, 30000);
  assert.equal((await api(`/transactions/${id}`, 'DELETE')).status, 200); assert.equal((await api(`/transactions/${id}`, 'DELETE')).status, 404);
});
test('REST API contoh: anggaran serta validasi input', async t => {
  const api = await fixture(t); assert.equal((await api('/budget', 'PUT', { month: '2026-10', amount_rupiah: 1500000 })).status, 200);
  assert.equal((await api('/budget?month=2026-10')).data.amount_rupiah, 1500000); assert.equal((await api('/budget?month=2026-11')).data.amount_rupiah, 0);
  assert.equal((await api('/transactions', 'POST', { ...tx, amount_rupiah: -1 })).status, 400); assert.equal((await api('/transactions?month=2026-13')).status, 400);
});
