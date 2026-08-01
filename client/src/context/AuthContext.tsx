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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('finora_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.success && res.user) {
          setUser({
            id: res.user._id,
            name: res.user.name,
            email: res.user.email,
            defaultCurrency: res.user.defaultCurrency || 'INR',
            dateFormat: res.user.dateFormat || 'DD/MM/YYYY',
            theme: res.user.theme || 'dark',
            defaultOwner: res.user.defaultOwner || 'Me',
            notificationsEnabled: res.user.notificationsEnabled ?? true,
          });
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('finora_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      localStorage.setItem('finora_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword?: string) => {
    const res = await api.post('/auth/register', { name, email, password, confirmPassword });
    if (res.success && res.token) {
      localStorage.setItem('finora_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('finora_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const res = await api.put('/auth/profile', data);
    if (res.success && res.user) {
      setUser((prev) => (prev ? { ...prev, ...res.user } : res.user));
    }
  };

  const loadDemoData = async () => {
    await api.post('/auth/seed-demo');
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
