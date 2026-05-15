'use client';

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/api';


interface User {
  id: string;
  name: string;
  email: string;
  role: 'GESTOR' | 'PROFISSIONAL' | 'CLIENTE';
}

interface AuthContextData {
  user: User | null;

  signIn: (
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => void;

  loading: boolean;
}

interface Props {
  children: ReactNode;
}

export const AuthContext =
  createContext({} as AuthContextData);

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function signIn(
    email: string,
    password: string,
  ) {
    const response = await api.post(
      '/auth/login',
      {
        email,
        password,
      },
    );

    const { accessToken, user } =
      response.data;

    localStorage.setItem(
      '@marquei:token',
      accessToken,
    );

    localStorage.setItem(
      '@marquei:user',
      JSON.stringify(user),
    );

    setUser(user);
  }

  function logout() {
    localStorage.removeItem(
      '@marquei:token',
    );

    localStorage.removeItem(
      '@marquei:user',
    );

    setUser(null);

    window.location.href = '/login';
  }

  useEffect(() => {
    const storedUser = localStorage.getItem(
      '@marquei:user',
    );

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}