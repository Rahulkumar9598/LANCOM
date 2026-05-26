import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const department = JSON.parse(localStorage.getItem('department') || '{}');
  const navigate = useNavigate();

  // Redirect if service expired
  useEffect(() => {
    if (department.serviceExpiresAt && new Date(department.serviceExpiresAt) < new Date()) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('department');
      // Notify user
      alert('Service expired. Please purchase subscription.');
      navigate('/service-expired');
    }
  }, []);

  if (!token) {
    return <Navigate to="/" />;
  }
  
  if (adminOnly && department.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default PrivateRoute;