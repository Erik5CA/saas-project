'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { User, AuthResponse } from '../types/api';
import { api } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const cookies = parseCookies();
      const token = cookies['auth_token'];

      if (token) {
        try {
          const response = await api.get<{ user: User }>('/auth/profile');
          setUser(response.user);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);


  const login = (response: AuthResponse) => {
    console.log({response});
    setCookie(null, 'auth_token', response.accessToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    setUser(response.user);
  };

  const logout = () => {
    destroyCookie(null, 'auth_token', { path: '/' });
    destroyCookie(null, 'selected_tenant_id', { path: '/' });
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
