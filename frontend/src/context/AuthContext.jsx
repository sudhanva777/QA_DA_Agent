import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'insightflow_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          setUser(parsed.user);
          setIsAuthenticated(true);
          // Set the token in api client for subsequent requests
          api.setAuthToken(parsed.token);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.login(email, password);
      const { user, token } = response;
      const userData = { ...user, token: token.access_token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: token.access_token }));
      setUser(userData);
      setIsAuthenticated(true);
      api.setAuthToken(token.access_token);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Invalid email or password';
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await api.register(name, email, password);
      const { user, token } = response;
      const userData = { ...user, token: token.access_token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: token.access_token }));
      setUser(userData);
      setIsAuthenticated(true);
      api.setAuthToken(token.access_token);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
    api.setAuthToken(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const newUser = { ...user, ...updates };
    setUser(newUser);

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...parsed,
          user: newUser,
        }));
      } catch {
      }
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.getCurrentUser();
      const userData = { ...response, token: user.token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: user.token }));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      logout();
      return { success: false, error: 'Session expired' };
    }
  }, [logout]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}