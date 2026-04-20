import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '@/types';

interface ProtectedRouteProps {
  user: User | null;
  requireAdmin?: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({ user, requireAdmin = false, children }: ProtectedRouteProps): React.ReactElement {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.rol !== 'admin') {
    return <Navigate to="/mis-cursos" replace />;
  }

  return <>{children}</>;
}