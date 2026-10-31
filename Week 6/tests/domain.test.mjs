import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, transactionFromDTO, transactionToDTO, validateTransaction, validDate, validMonth, shiftMonth } from '../mobile/src/weeks/week04/task01-data-model.js';
import { validateCredentials } from '../mobile/src/weeks/week03/task03-security-validation.js';
import { createSessionStore } from '../mobile/src/weeks/week03/session-store.js';
const tx = { id: 'a', title: 'Makan siang', type: 'expense', amount: 25000, category: 'Makan', date: '2026-10-27' };
test('saldo, anggaran, dan rekap kategori dihitung dari data transaksi', () => {
  const result = summarize([{ ...tx, type: 'income', amount: 100000, category: 'Uang saku' }, tx, { ...tx, amount: 10000 }], 30000);
  assert.equal(result.balance, 65000); assert.equal(result.expense, 35000); assert.equal(result.remaining, -5000); assert.equal(result.percent, 117); assert.deepEqual(result.byCategory, [{ category: 'Makan', total: 35000 }]);
});
test('anggaran kosong tidak menghasilkan NaN atau Infinity', () => { assert.equal(summarize([], 0).percent, 0); });
test('DTO dipetakan tanpa membawa field internal server', () => {
  const dto = { id: 'a', ...transactionToDTO(tx), user_id: 'rahasia', internal_note: 'internal' };
  assert.deepEqual(transactionFromDTO(dto), tx); assert.equal('user_id' in transactionFromDTO(dto), false);
});
test('DTO rusak ditolak, nominal negatif atau string tidak diterima', () => {
  for (const amount_rupiah of [-5, '25000', 0, 1.5]) assert.throws(() => transactionFromDTO({ id: 'a', ...transactionToDTO(tx), amount_rupiah }));
});
test('validasi transaksi menolak nominal, kategori, dan tanggal tidak valid', () => {
  assert.equal(validateTransaction(tx), '');
  for (const bad of [{ amount: -1 }, { amount: 1.2 }, { amount: 1000000001 }, { category: 'Beasiswa' }, { date: '2026-02-30' }, { title: '' }]) assert.notEqual(validateTransaction({ ...tx, ...bad }), '');
});
test('tanggal kabisat dan perpindahan tahun dikenali dengan benar', () => {
  assert.equal(validDate('2024-02-29'), true); assert.equal(validDate('2025-02-29'), false); assert.equal(validDate('invalid'), false); assert.equal(validMonth('2026-13'), false);
  assert.equal(shiftMonth('2026-12', 1), '2027-01'); assert.equal(shiftMonth('2026-01', -1), '2025-12');
});
test('login dan register memiliki validasi kosong, email, password dan konfirmasi', () => {
  assert.notEqual(validateCredentials({}), ''); assert.notEqual(validateCredentials({ email: 'a', password: 'password' }), '');
  assert.notEqual(validateCredentials({ email: 'a@b.id', password: 'short' }), '');
  assert.notEqual(validateCredentials({ email: 'a@b.id', password: 'password', name: 'Sofia', confirmPassword: 'beda' }, true), '');
  assert.equal(validateCredentials({ email: 'a@b.id', password: 'password', name: 'Sofia', confirmPassword: 'password' }, true), '');
});
test('adapter sesi menulis, membaca kembali, dan menghapus token', async () => {
  const map = new Map(); const store = createSessionStore({ get: async k => map.get(k) || null, set: async (k, v) => map.set(k, v), remove: async k => map.delete(k) });
  assert.equal(await store.get(), null); await store.set('token-untuk-test'); assert.equal(await store.get(), 'token-untuk-test'); await store.clear(); assert.equal(await store.get(), null); await assert.rejects(store.set(''));
});
