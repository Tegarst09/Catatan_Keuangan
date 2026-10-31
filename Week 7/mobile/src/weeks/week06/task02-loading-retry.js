import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureConnected } from './task03-offline';
import { initialResource, resourceReducer } from './request-state';
export function useRemoteResource(loader, { offline = false, enabled = true, scopeKey = '' } = {}) {
  const [state, setState] = useState(initialResource); const sequence = useRef(0); const controller = useRef(null);
  const retry = useCallback(async () => {
    const id = ++sequence.current; controller.current?.abort();
    if (!enabled) return;
    if (offline) { setState(resourceReducer(null, { type: 'error', error: { code: 'OFFLINE', message: 'Tidak ada koneksi. Aktifkan Wi-Fi atau data seluler lalu coba lagi.' } })); return; }
    const abort = new AbortController(); controller.current = abort;
    setState(resourceReducer(null, { type: 'loading' }));
    try {
      await ensureConnected(); const data = await loader(abort.signal);
      if (id === sequence.current) setState(resourceReducer(null, { type: 'success', data, empty: data.transactions?.length === 0 }));
    } catch (error) { if (id === sequence.current && error.code !== 'CANCELLED') setState(resourceReducer(null, { type: 'error', error })); }
  }, [loader, offline, enabled, scopeKey]);
  useEffect(() => { retry(); return () => { sequence.current++; controller.current?.abort(); }; }, [retry]);
  return { ...state, retry };
}
