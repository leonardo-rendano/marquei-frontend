'use client';

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'GESTOR' | 'PROFISSIONAL' | 'CLIENTE';
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const storedUser = localStorage.getItem('@marquei:user');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  async function signIn(email: string, password: string) {
    const { api } = await import('../services/api');

    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { accessToken, user } = response.data;

    localStorage.setItem('@marquei:token', accessToken);
    localStorage.setItem('@marquei:user', JSON.stringify(user));

    setUser(user);
  }

  function logout() {
    localStorage.removeItem('@marquei:token');
    localStorage.removeItem('@marquei:user');

    setUser(null);

    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}