import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pt_admin_token'));
  const [user, setUser] = useState(() => localStorage.getItem('pt_admin_user'));

  async function login(username, password) {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setToken(data.token);
    setUser(data.username);
    localStorage.setItem('pt_admin_token', data.token);
    localStorage.setItem('pt_admin_user', data.username);
    return data;
  }

  function logout() {
    setToken(null); setUser(null);
    localStorage.removeItem('pt_admin_token');
    localStorage.removeItem('pt_admin_user');
  }

  return <AuthContext.Provider value={{ token, user, login, logout, isAuth: !!token }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export async function adminFetch(path, token, opts = {}) {
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Error'); }
  return res.json();
}
