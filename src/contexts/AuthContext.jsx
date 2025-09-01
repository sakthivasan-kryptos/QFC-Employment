import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

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

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials validation
      const demoCredentials = [
        { email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { email: 'user@example.com', password: 'user123', role: 'user' },
        { email: 'demo@test.com', password: 'demo123', role: 'demo' }
      ];
      
      const validUser = demoCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (!validUser) {
        throw new Error('Invalid email or password');
      }
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: validUser.email,
        role: validUser.role,
        name: validUser.email.split('@')[0],
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      
      // Save to localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }
      
      // Show success message
      message.success('Signed in successfully.', 3);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};