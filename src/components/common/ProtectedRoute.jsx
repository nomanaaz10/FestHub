import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AdminRoute({ children, superAdminOnly = false }) {
  const { currentUser, isSuperAdmin, isSubAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!superAdminOnly && !isSubAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
