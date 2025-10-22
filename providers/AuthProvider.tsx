"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a proper User type later
  login: (token: string) => void;
  logout: () => void;
  setAuthStatus: (status: boolean, userData?: any) => void; // New method to set auth status
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = (token: string) => {
    localStorage.setItem('jwt_token', token);
    setIsAuthenticated(true);
    // setUser(decodeToken(token)); // Example: decode token to get user data
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const setAuthStatus = (status: boolean, userData?: any) => {
    setIsAuthenticated(status);
    setUser(userData || null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
