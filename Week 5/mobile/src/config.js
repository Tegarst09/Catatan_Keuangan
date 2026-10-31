import { validateApiUrl } from './weeks/week04/task02-rest-api';
export const API_URL = validateApiUrl(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
  { development: typeof __DEV__ !== 'undefined' && __DEV__, allowInsecureLan: process.env.EXPO_PUBLIC_ALLOW_INSECURE_LAN === 'true' }
);
export const TEST_SCENARIO = '';
