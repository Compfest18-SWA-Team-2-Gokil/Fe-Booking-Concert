import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../domain/User';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadFromStorage(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem('tiketin_token');
    const raw = localStorage.getItem('tiketin_user');
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(loadFromStorage);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('tiketin_token', token);
    localStorage.setItem('tiketin_user', JSON.stringify(user));
    setState({ token, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tiketin_token');
    localStorage.removeItem('tiketin_user');
    setState({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
