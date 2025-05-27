import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If user is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
