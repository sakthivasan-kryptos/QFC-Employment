import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ComplianceProvider } from './contexts/ComplianceContext';
import { BrowserRouter } from 'react-router-dom'; // <-- MUST have this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ComplianceProvider>
          <App />
        </ComplianceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
