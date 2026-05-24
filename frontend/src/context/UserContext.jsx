import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pt_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pt_token') || null);

  function login(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('pt_user', JSON.stringify(userData));
    localStorage.setItem('pt_token', userToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pt_user');
    localStorage.removeItem('pt_token');
  }

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
