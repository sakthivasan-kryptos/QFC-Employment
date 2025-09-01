import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  className = '',
  onClose,
  dismissible = false 
}) => {
  if (!message) return null;

  return (
    <div className={`error-message error-${type} ${className}`} role="alert">
      <div className="error-content">
        <span className="error-icon">
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚡'}
          {type === 'info' && 'ℹ️'}
          {type === 'success' && '✅'}
        </span>
        <span className="error-text">{message}</span>
      </div>
      {dismissible && onClose && (
        <button 
          className="error-close" 
          onClick={onClose}
          aria-label="Close error message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;