import { ApiError, httpError } from '../week06/task01-api-error.js';
export function validateApiUrl(value, { development = false, allowInsecureLan = false } = {}) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash) throw new Error('URL API tidak boleh berisi kredensial, query, atau fragment.');
  const host = url.hostname;
  const local = ['localhost', '127.0.0.1', '10.0.2.2', '[::1]'].includes(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && development && allowInsecureLan && local)) throw new Error('Gunakan API HTTPS. HTTP LAN hanya diizinkan pada development dengan konfigurasi eksplisit.');
  return value.replace(/\/$/, '');
}
export async function requestJSON(baseURL, path, { method = 'GET', body, headers = {}, timeoutMs = 8000, signal, fetchImpl = fetch } = {}) {
  const controller = new AbortController(); let timedOut = false;
  const cancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', cancel);
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    const response = await fetchImpl(`${baseURL}${path}`, {
      method, headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}), signal: controller.signal
    });
    let data;
    try { data = await response.json(); }
    catch { if (!response.ok) throw httpError(response.status); throw new ApiError('Format respons server tidak sesuai.', { code: 'FORMAT' }); }
    if (!response.ok) throw httpError(response.status, data?.message);
    return data;
  } catch (error) {
    if (timedOut) throw new ApiError('Server terlalu lama merespons. Silakan coba lagi.', { code: 'TIMEOUT' });
    if (signal?.aborted) throw new ApiError('Permintaan dibatalkan.', { code: 'CANCELLED' });
    if (error instanceof ApiError) throw error;
    throw new ApiError('Tidak dapat menghubungi server. Periksa koneksi dan alamat API.', { code: 'NETWORK' });
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); }
}
