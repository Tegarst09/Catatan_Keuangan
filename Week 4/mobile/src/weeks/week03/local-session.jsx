import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Crypto from 'expo-crypto';
import { createLocalAuth } from './local-auth';
import { localVault } from './task02-secure-storage';
import { API_URL } from '../../config';
import { requestJSON } from '../week04/task02-rest-api';
const auth = createLocalAuth({ vault: localVault, randomBytes: count => Crypto.getRandomBytes(count) });
const Context = createContext(null);
export const useSession = () => useContext(Context);
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null); const [booting, setBooting] = useState(true); const [notice, setNotice] = useState('');
  const restore = useCallback(async () => {
    setBooting(true);
    try { setSession(await auth.restore()); setNotice(''); }
    catch { setSession(null); setNotice('Penyimpanan akun belum dapat diakses. Coba pulihkan sesi.'); }
    finally { setBooting(false); }
  }, []);
  useEffect(() => { restore(); }, [restore]);
  const signIn = useCallback(async (credentials, registering) => {
    const next = await (registering ? auth.register(credentials) : auth.login(credentials)); setNotice(''); setSession(next);
  }, []);
  const logout = useCallback(async () => { await auth.logout(); setSession(null); setNotice('Kamu sudah keluar.'); }, []);
  useEffect(() => {
    if (!session) return;
    const expire = () => { auth.logout().finally(() => { setSession(null); setNotice('Sesi berakhir. Silakan masuk kembali.'); }); };
    const timer = setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    const sub = AppState.addEventListener('change', state => { if (state === 'active' && session.expiresAt <= Date.now()) expire(); });
    return () => { clearTimeout(timer); sub.remove(); };
  }, [session]);
  const api = useCallback((path, options = {}) => requestJSON(API_URL, path, options), []);
  return <Context.Provider value={{ user: session?.user, booting, notice, signIn, logout, restore , api }}>{children}</Context.Provider>;
}
