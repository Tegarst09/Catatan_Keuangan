import test from 'node:test';
import assert from 'node:assert/strict';
import { requestJSON, validateApiUrl } from '../mobile/src/weeks/week04/task02-rest-api.js';
import { authorizedRequest } from '../mobile/src/weeks/week05/task02-authorized-request.js';
import { resourceReducer } from '../mobile/src/weeks/week06/request-state.js';
const baseURL = 'https://api.example.test';
test('request JSON sukses mengirim method, header, dan body yang sesuai', async () => {
  let sent;
  const result = await requestJSON(baseURL, '/x', { method: 'POST', body: { title: 'makan' }, fetchImpl: async (url, options) => { sent = { url, ...options }; return new Response('{"ok":true}', { status: 201 }); } });
  assert.equal(result.ok, true); assert.equal(sent.url, `${baseURL}/x`); assert.equal(sent.headers['Content-Type'], 'application/json'); assert.equal(sent.body, '{"title":"makan"}');
});
test('4xx dan 5xx ditolak dengan status dan pesan yang aman', async () => {
  for (const status of [400, 401, 403, 404, 409, 429, 500, 503]) await assert.rejects(requestJSON(baseURL, '/x', { fetchImpl: async () => new Response('{"message":"internal-secret"}', { status }) }), e => e.status === status && !e.message.includes('internal-secret'));
});
test('respons JSON tidak valid dan network error menjadi pesan yang dapat ditampilkan', async () => {
  await assert.rejects(requestJSON(baseURL, '/x', { fetchImpl: async () => new Response('not json') }), e => e.code === 'FORMAT');
  await assert.rejects(requestJSON(baseURL, '/x', { fetchImpl: async () => { throw new TypeError('ECONNREFUSED raw'); } }), e => e.code === 'NETWORK' && !e.message.includes('ECONNREFUSED'));
});
test('timeout membatalkan permintaan dan berbeda dari error HTTP', async () => {
  await assert.rejects(requestJSON(baseURL, '/x', { timeoutMs: 10, fetchImpl: async (_u, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))) }), e => e.code === 'TIMEOUT');
});
test('request yang dibatalkan saat unmount tidak berubah menjadi network error', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(requestJSON(baseURL, '/x', { signal: controller.signal, fetchImpl: async (_u, { signal }) => { assert.equal(signal.aborted, true); throw new Error('abort'); } }), e => e.code === 'CANCELLED');
});
test('bearer otomatis dipasang dan respons 401 memanggil pembersihan sesi', async () => {
  let header; let cleared = false;
  await authorizedRequest(baseURL, '/protected', { token: 'test-token', fetchImpl: async (_u, options) => { header = options.headers.Authorization; return new Response('{"ok":true}'); } });
  assert.equal(header, 'Bearer test-token');
  await assert.rejects(authorizedRequest(baseURL, '/protected', { token: 'expired', onUnauthorized: async () => { cleared = true; }, fetchImpl: async () => new Response('{}', { status: 401 }) })); assert.equal(cleared, true);
});
test('HTTP publik ditolak, HTTP LAN hanya melalui opt-in development', () => {
  assert.throws(() => validateApiUrl('http://api.public.example/api', { development: true, allowInsecureLan: true }));
  assert.throws(() => validateApiUrl('http://192.168.1.2:3001/api'));
  assert.equal(validateApiUrl('http://192.168.1.2:3001/api', { development: true, allowInsecureLan: true }), 'http://192.168.1.2:3001/api');
  assert.equal(validateApiUrl('https://api.example.test/api/'), 'https://api.example.test/api');
});
test('state error/offline menghapus data lama, retry beralih loading lalu sukses/empty', () => {
  const previous = { status: 'success', data: ['catatan privat'] };
  const failed = resourceReducer(previous, { type: 'error', error: { code: 'OFFLINE', message: 'offline' } });
  assert.equal(failed.status, 'offline'); assert.equal(failed.data, null);
  const loading = resourceReducer(failed, { type: 'loading' }); assert.equal(loading.status, 'loading'); assert.equal(loading.error, null);
  assert.equal(resourceReducer(loading, { type: 'success', data: { transactions: [] }, empty: true }).status, 'empty');
  assert.equal(resourceReducer(loading, { type: 'success', data: { transactions: [{}] }, empty: false }).status, 'success');
});
