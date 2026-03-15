import React, { createContext, useState, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'barber' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role: 'customer',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    const mockUser: User = {
      id: '2',
      name,
      email,
      role: 'customer',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const loginWithGoogle = async () => {
    const mockUser: User = {
      id: '3',
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'customer',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const loginWithApple = async () => {
    const mockUser: User = {
      id: '4',
      name: 'Apple User',
      email: 'user@icloud.com',
      role: 'customer',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}