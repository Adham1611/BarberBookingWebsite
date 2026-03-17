import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, shopsApi, type User, type Shop } from '../api/api';

interface AuthContextValue {
  user: User | null;
  shop: Shop | null;
  myShops: Shop[];
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  registerOwner: (data: { name: string; email: string; password: string; phone?: string; shopName: string; shopSlug: string }) => Promise<{ shop: Shop }>;
  logout: () => void;
  setActiveShop: (shop: Shop) => void;
  refreshMyShops: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedShop = localStorage.getItem('activeShop');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch { /* ignore */ }
    }
    if (storedShop) {
      try {
        setShop(JSON.parse(storedShop));
      } catch { /* ignore */ }
    }

    setLoading(false);
  }, []);

  // Fetch shops when user is set and is owner/admin/barber
  const refreshMyShops = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) return;
    try {
      const shops = await shopsApi.getMyShops();
      setMyShops(shops);
      // Auto-select first shop if none selected
      if (shops.length > 0 && !shop) {
        setShop(shops[0]);
        localStorage.setItem('activeShop', JSON.stringify(shops[0]));
      }
    } catch { /* not critical */ }
  }, [shop]);

  useEffect(() => {
    if (user && ['owner', 'barber', 'admin'].includes(user.role)) {
      refreshMyShops();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = (userData: User, token: string, refreshToken: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    persist(res.user, res.accessToken, res.refreshToken);
  };

  const register = async (data: Parameters<typeof authApi.register>[0]) => {
    const res = await authApi.register(data);
    persist(res.user, res.accessToken, res.refreshToken);
  };

  const registerOwner = async (data: Parameters<typeof authApi.registerOwner>[0]) => {
    const res = await authApi.registerOwner(data);
    persist(res.user, res.accessToken, res.refreshToken);
    if (res.shop) {
      setShop(res.shop);
      localStorage.setItem('activeShop', JSON.stringify(res.shop));
    }
    return { shop: res.shop };
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('activeShop');
    setUser(null);
    setShop(null);
    setMyShops([]);
  };

  const setActiveShop = (s: Shop) => {
    setShop(s);
    localStorage.setItem('activeShop', JSON.stringify(s));
  };

  return (
    <AuthContext.Provider value={{
      user,
      shop,
      myShops,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      registerOwner,
      logout,
      setActiveShop,
      refreshMyShops,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
