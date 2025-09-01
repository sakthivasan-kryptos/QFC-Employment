import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { ComplianceProvider } from './contexts/ComplianceContext';
import { Header, Sidebar } from './components/layout';
import { Dashboard, NewReview, AllReviews, Regulations, Reports, Settings, LoginPage, ReviewResults } from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import './styles/App.css';

const { Content } = Layout;
// Router-based app layout 
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
      collapsed={sidebarCollapsed} onSidebarToggle={() => setSidebarCollapsed(prev => !prev)}
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000
      }}/>
      
      <Layout>
       {sidebarCollapsed ? <Sidebar collapsed={collapsed} /> : null}

        
        <Content className="qfc-content" >
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
    <AuthProvider>
      <ComplianceProvider>
        <Router>
          <Routes>
            {/* Public route - Login */}
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
        </Router>
      </ComplianceProvider>
    </AuthProvider>
  );
}

export default App;