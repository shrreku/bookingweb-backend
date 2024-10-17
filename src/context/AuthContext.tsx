import React, { createContext, useState, useContext, useEffect } from 'react';
import { setAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const login = (token: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', username);
    setAuthToken(token);
    setIsAuthenticated(true);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);