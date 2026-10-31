import test from 'node:test';
import assert from 'node:assert/strict';
import { transactionFromDTO, transactionToDTO, summarize, validDate } from '../mobile/src/weeks/week04/task01-data-model.js';
import { requestJSON, validateApiUrl } from '../mobile/src/weeks/week04/task02-rest-api.js';
test('mapping DTO dan perhitungan rupiah', () => {
  const model = { id: 'a', title: 'Makan', type: 'expense', amount: 25000, category: 'Makan', date: '2026-10-27' };
  assert.deepEqual(transactionFromDTO({ id: model.id, ...transactionToDTO(model), internal: 'tidak-dipakai' }), model);
  const s = summarize([model, { ...model, type: 'income', category: 'Uang saku', amount: 2000000 }], 1500000);
  assert.equal(s.balance, 1975000); assert.equal(s.remaining, 1475000); assert.equal(validDate('2026-02-30'), false);
});
test('fetch memeriksa HTTP dan memproses JSON', async () => {
  assert.deepEqual(await requestJSON('https://example.test', '/items', { fetchImpl: async () => new Response('{"data":[]}') }), { data: [] });
  await assert.rejects(requestJSON('https://example.test', '/items', { fetchImpl: async () => new Response('{}', { status: 500 }) }), e => e.status === 500);
  assert.throws(() => validateApiUrl('http://api.public.test'));
});
