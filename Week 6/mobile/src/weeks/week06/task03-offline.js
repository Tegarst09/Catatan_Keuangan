import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { ApiError } from './task01-api-error';
const browserOffline = () => Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.onLine === false;
export function useOffline() {
  const [offline, setOffline] = useState(browserOffline);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setOffline(state.isConnected === false || browserOffline()));
    // Browser dengan navigator.connection belum tentu menerbitkan event change ketika offline.
    const updateBrowser = () => setOffline(browserOffline());
    if (Platform.OS === 'web' && typeof window !== 'undefined') { window.addEventListener('online', updateBrowser); window.addEventListener('offline', updateBrowser); }
    return () => {
      unsubscribe();
      if (Platform.OS === 'web' && typeof window !== 'undefined') { window.removeEventListener('online', updateBrowser); window.removeEventListener('offline', updateBrowser); }
    };
  }, []);
  return offline;
}
export async function ensureConnected() {
  if (browserOffline()) throw new ApiError('Tidak ada koneksi. Aktifkan Wi-Fi atau data seluler lalu coba lagi.', { code: 'OFFLINE' });
  const state = await NetInfo.fetch();
  if (state.isConnected === false) throw new ApiError('Tidak ada koneksi. Aktifkan Wi-Fi atau data seluler lalu coba lagi.', { code: 'OFFLINE' });
}
