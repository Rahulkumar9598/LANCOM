import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const token = localStorage.getItem('token');
  const department = JSON.parse(localStorage.getItem('department') || '{}');

  if (!token) return <Navigate to="/" replace />;

  // Check service expiry synchronously — no useEffect flash
  if (department.serviceExpiresAt && new Date(department.serviceExpiresAt) < new Date()) {
    return <Navigate to="/service-expired" replace />;
  }

  if (adminOnly && department.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (superAdminOnly && department.role !== 'superadmin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default PrivateRoute;
