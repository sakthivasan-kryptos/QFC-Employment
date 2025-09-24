import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
const pb = new PocketBase('http://127.0.0.1:8090');
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    } else {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
    }
    setLoading(false);
  }, []);

 const login = async (email, password, rememberMe = false) => {
  setLoading(true);
  try {
    // Authenticate via PocketBase
    const authData = await pb.collection('users').authWithPassword(email, password);
    // Save user and token in state
    setUser(authData.record);

    // PocketBase internal authStore
    pb.authStore.save(authData.token, rememberMe);

    // Also save in localStorage if "Remember Me" is checked
    if (rememberMe) {
      localStorage.setItem('auth_user', JSON.stringify(authData.record));
      localStorage.setItem('auth_token', authData.token);
    }

    message.success('Signed in successfully', 3);

    return { success: true, user: authData.record, token: authData.token };

  } catch (err) {
    console.error('Login error:', err);

    // Default PocketBase error
    const pbMessage = err.data?.message || err.message || '';

    // Custom message if PocketBase returned "Failed to authenticate"
    let errorMessage = pbMessage === "Failed to authenticate."
      ? "Please check your login credentials."
      : pbMessage || "Login failed. Please try again.";

    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    pb.authStore.clear();

    message.info('Logged out successfully', 3);

    navigate('/login', { replace: true });
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
