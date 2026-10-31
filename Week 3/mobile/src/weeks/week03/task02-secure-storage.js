import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
const browserMemory = new Map();
// Web memakai memori tab. Android/iOS memakai penyimpanan aman sistem operasi.
export const localVault = Platform.OS === 'web' ? {
  get: async key => browserMemory.get(key) || null,
  set: async (key, value) => { browserMemory.set(key, value); },
  remove: async key => { browserMemory.delete(key); }
} : {
  get: key => SecureStore.getItemAsync(key),
  set: (key, value) => SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
  remove: key => SecureStore.deleteItemAsync(key)
};
