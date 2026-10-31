import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';
import { validateCredentials } from './task03-security-validation.js';
export const PASSWORD_ITERATIONS = 600000;
export const accountKeyFor = email => `moneytrack.local.account.${bytesToHex(sha256(utf8ToBytes(email.trim().toLowerCase())))}`;
export async function derivePassword(password, saltHex, iterations = PASSWORD_ITERATIONS) {
  return bytesToHex(await pbkdf2Async(sha256, utf8ToBytes(password), hexToBytes(saltHex), { c: iterations, dkLen: 32 }));
}
function equalHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
export function createLocalAuth({ vault, randomBytes, now = Date.now, iterations = PASSWORD_ITERATIONS, sessionMs = 1800000 }) {
  const sessionKey = 'moneytrack.local.session.v1';
  const publicUser = record => ({ id: record.id, name: record.name, email: record.email });
  const read = async key => { const value = await vault.get(key); return value ? JSON.parse(value) : null; };
  const issue = async (record, accountKey) => {
    const expiresAt = now() + sessionMs;
    await vault.set(sessionKey, JSON.stringify({ accountKey, userId: record.id, token: bytesToHex(randomBytes(32)), expiresAt }));
    return { user: publicUser(record), expiresAt };
  };
  return {
    async register({ name, email, password }) {
      const error = validateCredentials({ name, email, password, confirmPassword: password }, true);
      if (error) throw new Error(error);
      const normalized = email.trim().toLowerCase(); const accountKey = accountKeyFor(normalized);
      if (await vault.get(accountKey)) throw new Error('Email telah terdaftar pada perangkat ini. Silakan masuk.');
      const salt = bytesToHex(randomBytes(16));
      const record = { id: bytesToHex(randomBytes(16)), name: name.trim(), email: normalized, salt, iterations, passwordHash: await derivePassword(password, salt, iterations) };
      await vault.set(accountKey, JSON.stringify(record));
      return issue(record, accountKey);
    },
    async login({ email, password }) {
      const error = validateCredentials({ email, password }); if (error) throw new Error(error);
      const accountKey = accountKeyFor(email); const record = await read(accountKey);
      const actual = await derivePassword(password, record?.salt || '00'.repeat(16), record?.iterations || iterations);
      if (!record || !equalHex(actual, record.passwordHash)) throw new Error('Email atau password tidak sesuai.');
      return issue(record, accountKey);
    },
    async restore() {
      let session;
      try { session = await read(sessionKey); } catch { await vault.remove(sessionKey); return null; }
      if (!session) return null;
      if (typeof session.accountKey !== 'string' || !/^[a-f0-9]{64}$/.test(session.token || '') || !Number.isFinite(session.expiresAt) || session.expiresAt <= now()) { await vault.remove(sessionKey); return null; }
      const record = await read(session.accountKey);
      if (!record || record.id !== session.userId) { await vault.remove(sessionKey); return null; }
      return { user: publicUser(record), expiresAt: session.expiresAt };
    },
    async logout() { await vault.remove(sessionKey); }
  };
}
