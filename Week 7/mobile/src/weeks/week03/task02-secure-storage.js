import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createSessionStore } from './session-store.js';
// Web hanya pratinjau: token di memori, tidak memakai localStorage/AsyncStorage.
let webToken = null;
export const sessionStore = createSessionStore(Platform.OS === 'web' ? {
  get: async () => webToken, set: async (_key, value) => { webToken = value; }, remove: async () => { webToken = null; }
} : {
  get: key => SecureStore.getItemAsync(key),
  set: (key, value) => SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
  remove: key => SecureStore.deleteItemAsync(key)
});
