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
  LoginPage
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-review" element={<NewReview />} />
            <Route path="/all-reviews" element={<AllReviews />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
