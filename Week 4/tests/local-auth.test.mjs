import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { createLocalAuth, derivePassword, PASSWORD_ITERATIONS, accountKeyFor } from '../mobile/src/weeks/week03/local-auth.js';
function fixture() {
  const entries = new Map(); let clock = 1000;
  const vault = { get: async key => entries.get(key) || null, set: async (key, value) => entries.set(key, value), remove: async key => entries.delete(key) };
  return { entries, vault, advance: n => { clock += n; }, auth: createLocalAuth({ vault, randomBytes: n => new Uint8Array(randomBytes(n)), now: () => clock, iterations: 1000, sessionMs: 10000 }) };
}
const credentials = { name: 'Mahasiswa Uji', email: 'uji@example.test', password: 'Latihan123!' };
test('PBKDF2 default cocok dengan Node pada 600000 iterasi', async () => {
  const salt = '01'.repeat(16); const actual = await derivePassword('PasswordUji!', salt);
  assert.equal(PASSWORD_ITERATIONS, 600000);
  assert.equal(actual, pbkdf2Sync('PasswordUji!', Buffer.from(salt, 'hex'), 600000, 32, 'sha256').toString('hex'));
});
test('register, logout, login, restore, dan tidak ada password asli tersimpan', async () => {
  const f = fixture(); const created = await f.auth.register(credentials);
  assert.equal(created.user.name, credentials.name); assert.equal((await f.auth.restore()).user.id, created.user.id);
  assert.equal([...f.entries.values()].join('').includes(credentials.password), false); assert.equal('passwordHash' in created.user, false);
  await f.auth.logout(); assert.equal(await f.auth.restore(), null);
  const signed = await f.auth.login({ ...credentials, email: 'UJI@example.test' }); assert.equal(signed.user.id, created.user.id);
});
test('credential salah/kosong dan email ganda ditolak', async () => {
  const f = fixture(); await f.auth.register(credentials); await f.auth.logout();
  await assert.rejects(f.auth.login({ ...credentials, password: 'PasswordSalah' }), /Email atau password/);
  await assert.rejects(f.auth.login({ email: '', password: '' })); await assert.rejects(f.auth.register(credentials), /terdaftar/);
  assert.equal(await f.auth.restore(), null);
});
test('sesi kedaluwarsa atau rusak dibersihkan', async () => {
  const f = fixture(); await f.auth.register(credentials); f.advance(11000); assert.equal(await f.auth.restore(), null);
  await f.vault.set('moneytrack.local.session.v1', 'not-json'); assert.equal(await f.auth.restore(), null);
  assert.equal(await f.vault.get('moneytrack.local.session.v1'), null);
});
test('salt berbeda antar akun dan pemilik sesi mengikuti login', async () => {
  const f = fixture(); const a = await f.auth.register(credentials); const second = { ...credentials, email: 'dua@example.test' }; const b = await f.auth.register(second);
  assert.notEqual(a.user.id, b.user.id);
  const x = JSON.parse(await f.vault.get(accountKeyFor(credentials.email))); const y = JSON.parse(await f.vault.get(accountKeyFor(second.email)));
  assert.notEqual(x.salt, y.salt); assert.notEqual(x.passwordHash, y.passwordHash);
  await f.auth.login(credentials); assert.equal((await f.auth.restore()).user.id, a.user.id);
});
