const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  products: (q = '') => apiFetch(`/api/products${q}`),
  product: (id) => apiFetch(`/api/products/${id}`),
  categories: () => apiFetch('/api/categories'),
  createOrder: (data) => apiFetch('/api/orders', { method: 'POST', body: data }),
  subscribe: (email) => apiFetch('/api/subscribers', { method: 'POST', body: { email } })
};
