import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [showMessage, contextHolder] = message.useMessage();

  const decodeToken = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Payload));
      return decoded;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const userData = decodeToken(token);
      if (userData) setUser(userData);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

      const token = response.data.access_token;
      if (!token) throw new Error('No access token returned from API');

      setToken(token); 

      const userData = decodeToken(token);
      if (!userData) throw new Error('Invalid token received');

      setUser(userData);

      // Save in localStorage
      localStorage.setItem('auth_token', token);
      if (rememberMe) {
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      showMessage.success('Signed in successfully');

      return { success: true, user: userData, token };
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Login failed';
      showMessage.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    delete axios.defaults.headers.common['Authorization'];

    showMessage.info('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, showMessage, token }}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};
