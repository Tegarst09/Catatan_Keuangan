// Adapter terpisah agar siklus set/get/delete SecureStore dapat diuji tanpa HP.
export function createSessionStore(adapter) {
  const key = 'moneytrack.access-token.v1';
  return {
    get: () => adapter.get(key),
    set: async token => { if (typeof token !== 'string' || !token) throw new Error('Token tidak valid.'); await adapter.set(key, token); },
    clear: () => adapter.remove(key)
  };
}
