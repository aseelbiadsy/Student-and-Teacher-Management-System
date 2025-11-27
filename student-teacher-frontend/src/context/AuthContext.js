import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, logout, getCurrentUser, register } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUser();
       setUser(userData.user || userData);
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);
       const userData = response.User || response.user || response;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      return await register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
      setUser(null);  
    }
  };

   const hasRole = (roleName) => {
    if (!user) return false;
    const roles = user.roles || user.Roles || [];
    return roles.includes(roleName);
  };

  const isTeacher = () => hasRole('Teacher');
  const isStudent = () => hasRole('Student');

  const value = {
    user,
    loginUser,
    registerUser,
    logoutUser,
    isTeacher,
    isStudent,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};