export const initialResource = { status: 'idle', data: null, error: null };
export function resourceReducer(_state, action) {
  if (action.type === 'loading') return { status: 'loading', data: null, error: null };
  if (action.type === 'success') return { status: action.empty ? 'empty' : 'success', data: action.data, error: null };
  if (action.type === 'error') return { status: action.error.code === 'OFFLINE' ? 'offline' : 'error', data: null, error: action.error };
  return initialResource;
}
