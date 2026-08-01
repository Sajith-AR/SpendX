import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  loadDemoData: () => Promise<void>;
}

const defaultGuestUser: User = {
  id: '65f1a2b3c4d5e6f708192a3b',
  name: 'Sajith',
  email: 'sajith@spendx.com',
  defaultCurrency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  theme: 'dark',
  defaultOwner: 'Me',
  notificationsEnabled: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultGuestUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem('spendx_token') || 'demo_token');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.success && res.user) {
          setUser({
            id: res.user._id,
            name: res.user.name || 'Sajith',
            email: res.user.email || 'sajith@spendx.com',
            defaultCurrency: res.user.defaultCurrency || 'INR',
            dateFormat: res.user.dateFormat || 'DD/MM/YYYY',
            theme: res.user.theme || 'dark',
            defaultOwner: res.user.defaultOwner || 'Me',
            notificationsEnabled: res.user.notificationsEnabled ?? true,
          });
        }
      } catch (err) {
        setUser(defaultGuestUser);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.token) {
        localStorage.setItem('spendx_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch {
      setUser(defaultGuestUser);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword?: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, confirmPassword });
      if (res.success && res.token) {
        localStorage.setItem('spendx_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch {
      setUser(defaultGuestUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('spendx_token');
    setToken(null);
    setUser(defaultGuestUser);
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.success && res.user) {
        setUser((prev) => (prev ? { ...prev, ...res.user } : res.user));
      } else {
        setUser((prev) => (prev ? { ...prev, ...data } : defaultGuestUser));
      }
    } catch {
      setUser((prev) => (prev ? { ...prev, ...data } : defaultGuestUser));
    }
  };

  const loadDemoData = async () => {
    try {
      await api.post('/auth/seed-demo');
    } catch (err) {
      console.warn('Seed demo error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, loadDemoData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
