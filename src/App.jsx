import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { Header, Sidebar } from './components/layout';
import {
  Dashboard,
  NewReview,
  AllReviews,
  Regulations,
  Reports,
  Settings,
  LoginPage,
  RegisterPage,
  ApprovePending,
  UsersPage,
  UserRegistration,
} from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

const { Content } = Layout;

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Layout>
      <Header collapsed={sidebarCollapsed} onSidebarToggle={() => setSidebarCollapsed(prev => !prev)} />
      <Layout>
        {!sidebarCollapsed && <Sidebar collapsed={sidebarCollapsed} />}
        <Content className="qfc-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Routes accessible by both admin and user */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-review"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <NewReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-reviews"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <AllReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Routes only for admin */}
            <Route
              path="/regulations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Regulations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvepending"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ApprovePending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-registration"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserRegistration />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
