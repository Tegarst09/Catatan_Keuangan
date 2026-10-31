import { useCallback, useEffect, useRef, useState } from 'react';
import { initialResource, resourceReducer } from './request-state';
export function useRemoteResource(loader, { enabled = true, scopeKey = '' } = {}) {
  const [state, setState] = useState(initialResource); const generation = useRef(0); const controller = useRef(null);
  const retry = useCallback(async () => {
    const current = ++generation.current; controller.current?.abort(); if (!enabled) return;
    const abort = new AbortController(); controller.current = abort;
    setState(resourceReducer(null, { type: 'loading' }));
    try {
      const data = await loader(abort.signal);
      if (current === generation.current) setState(resourceReducer(null, { type: 'success', data, empty: data.transactions?.length === 0 }));
    } catch (error) { if (current === generation.current && error.code !== 'CANCELLED') setState(resourceReducer(null, { type: 'error', error })); }
  }, [loader, enabled, scopeKey]);
  useEffect(() => { retry(); return () => { generation.current++; controller.current?.abort(); }; }, [retry]);
  return { ...state, retry };
}
