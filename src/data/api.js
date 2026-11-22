export const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8014';

export function apiFetch(path, options) {
  return fetch(`${apiBase}${path}`, options);
}
