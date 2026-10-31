import { randomBytes, scrypt, timingSafeEqual, randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { SignJWT, jwtVerify } from 'jose';
const derive = promisify(scrypt);
const issuer = 'money-track-api'; const audience = 'money-track-mobile';
export const publicUser = user => ({ id: user.id, name: user.name, email: user.email });
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex'); const hash = await derive(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, storedHash) {
  const [salt, hex] = (storedHash || `${'0'.repeat(32)}:${'0'.repeat(128)}`).split(':');
  const actual = await derive(password, salt, 64); const expected = Buffer.from(hex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function createAuth(store, secret, ttlSeconds = 1800) {
  if (typeof secret !== 'string' || secret.length < 32 || secret.includes('GENERATE_WITH')) throw new Error('JWT_SECRET minimal 32 karakter. Jalankan npm run setup.');
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 86400) throw new Error('TOKEN_TTL_SECONDS harus bilangan bulat 1–86400.');
  const key = new TextEncoder().encode(secret);
  return {
    async issue(user) {
      const jti = randomUUID(); const now = Math.floor(Date.now() / 1000); const exp = now + ttlSeconds;
      const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).setSubject(user.id).setJti(jti).setIssuer(issuer).setAudience(audience).setIssuedAt(now).setExpirationTime(exp).sign(key);
      await store.mutate(db => { db.sessions = db.sessions.filter(s => s.exp > now); db.sessions.push({ jti, user_id: user.id, exp }); });
      return { access_token: token, token_type: 'Bearer', expires_at: new Date(exp * 1000).toISOString(), user: publicUser(user) };
    },
    async verify(header) {
      if (!header?.startsWith('Bearer ')) return null;
      try {
        const { payload } = await jwtVerify(header.slice(7), key, { algorithms: ['HS256'], issuer, audience });
        const db = store.read(); const session = db.sessions.find(s => s.jti === payload.jti && s.user_id === payload.sub);
        const user = db.users.find(u => u.id === payload.sub);
        if (!session || !user || session.exp <= Date.now() / 1000) return null;
        return { user, session };
      } catch { return null; }
    },
    async revoke(jti) { await store.mutate(db => { db.sessions = db.sessions.filter(s => s.jti !== jti); }); }
  };
}
