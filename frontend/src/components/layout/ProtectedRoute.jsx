import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, requireAdmin = false, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.rol !== 'admin') {
    return <Navigate to="/mis-cursos" replace />;
  }

  return children;
}
