import { requestJSON } from '../week04/task02-rest-api.js';
export async function authenticate(baseURL, credentials, registering = false) {
  let result;
  try { result = await requestJSON(baseURL, registering ? '/auth/register' : '/auth/login', { method: 'POST', body: credentials }); }
  catch (error) { if (error.status === 401) error.message = 'Email atau password tidak sesuai.'; if (error.status === 409) error.message = 'Email telah digunakan. Silakan masuk atau gunakan email lain.'; throw error; }
  if (typeof result.access_token !== 'string' || !result.user?.id || !Number.isFinite(Date.parse(result.expires_at))) throw new Error('Respons autentikasi tidak sesuai.');
  return result;
}
