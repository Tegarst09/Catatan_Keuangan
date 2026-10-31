import { requestJSON } from '../week04/task02-rest-api.js';
import { ApiError } from '../week06/task01-api-error.js';
export async function authorizedRequest(baseURL, path, { token, onUnauthorized, ...options }) {
  if (!token) throw new ApiError('Silakan masuk kembali.', { status: 401, code: 'HTTP' });
  try {
    return await requestJSON(baseURL, path, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
  } catch (error) {
    if (error.status === 401) await onUnauthorized?.();
    throw error;
  }
}
