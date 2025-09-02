// Centralized API base URL resolution
// Priority:
// 1. Explicit env VITE_API_URL
// 2. Runtime override window.__NETRA_API_BASE
// 3. If running on localhost (any port) -> local backend http://localhost:5001/api
// 4. Deployed backend default
const DEFAULT_PROD = 'https://netra-8j8n.onrender.com/api';
const RUNTIME_OVERRIDE = (typeof window !== 'undefined' && window.__NETRA_API_BASE) || '';
const ENV_BASE = import.meta.env?.VITE_API_URL || '';
let derived = (ENV_BASE || RUNTIME_OVERRIDE || '').trim();

if (!derived) {
	// Auto dev detection: hostname indicates local environment
	const isLocal = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
	if (isLocal) {
		derived = 'http://localhost:5001/api';
	}
}

if (!derived) derived = DEFAULT_PROD;

derived = derived.replace(/\/$/, '');
export const API_BASE = derived;
export function resolveApi(path = '') {
	return `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
}
