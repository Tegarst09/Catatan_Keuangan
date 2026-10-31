import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { API_URL } from '../../config';
import { sessionStore } from '../week03/task02-secure-storage';
import { authenticate } from './task01-token-auth';
import { authorizedRequest } from './task02-authorized-request';
const Context = createContext(null);
export const useSession = () => useContext(Context);
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null); const [booting, setBooting] = useState(true); const [notice, setNotice] = useState(''); const epoch = useRef(0);
  const expire = useCallback(async (message = 'Sesi berakhir. Silakan masuk kembali.') => {
    epoch.current++; setSession(null); setNotice(message);
    try { await sessionStore.clear(); } catch { setNotice('Penyimpanan sesi belum dapat dibersihkan. Coba pulihkan sesi saat koneksi tersedia.'); }
  }, []);
  const restore = useCallback(async () => {
    const current = ++epoch.current; setBooting(true); setNotice('');
    try {
      const token = await sessionStore.get();
      if (token) {
        const result = await authorizedRequest(API_URL, '/auth/me', { token });
        if (current === epoch.current) setSession({ token, user: result.user, expiresAt: result.expires_at });
      } else if (current === epoch.current) setSession(null);
    } catch (e) {
      if (current === epoch.current) {
        if (e.status === 401) await expire();
        else { setSession(null); setNotice('Sesi tersimpan belum dapat diverifikasi. Periksa koneksi lalu coba pulihkan sesi.'); }
      }
    } finally { setBooting(false); }
  }, [expire]);
  useEffect(() => { restore(); }, [restore]);
  const signIn = useCallback(async (credentials, registering) => {
    const current = ++epoch.current;
    const result = await authenticate(API_URL, credentials, registering);
    await sessionStore.set(result.access_token);
    if (current === epoch.current) { setNotice(''); setSession({ token: result.access_token, user: result.user, expiresAt: result.expires_at }); }
  }, []);
  const api = useCallback(async (path, options = {}) => {
    const current = epoch.current; const token = await sessionStore.get();
    if (current !== epoch.current) throw new Error('Sesi berubah.');
    return authorizedRequest(API_URL, path, { ...options, token, onUnauthorized: async () => { if (current === epoch.current) await expire(); } });
  }, [expire]);
  const logout = useCallback(async () => {
    const token = session?.token; await expire('Kamu sudah keluar.');
    if (token) {
      try { await authorizedRequest(API_URL, '/auth/logout', { token, method: 'POST' }); }
      catch { setNotice('Kamu sudah keluar dari perangkat. Server belum dapat dihubungi untuk mencabut token; token berakhir paling lama 30 menit sesuai konfigurasi server.'); }
    }
  }, [session, expire]);
  useEffect(() => {
    if (!session) return;
    const delay = Date.parse(session.expiresAt) - Date.now();
    const timer = setTimeout(() => expire(), Math.max(0, delay));
    const sub = AppState.addEventListener('change', state => { if (state === 'active' && Date.parse(session.expiresAt) <= Date.now()) expire(); });
    return () => { clearTimeout(timer); sub.remove(); };
  }, [session, expire]);
  return <Context.Provider value={{ user: session?.user, booting, notice, signIn, api, logout, restore }}>{children}</Context.Provider>;
}
