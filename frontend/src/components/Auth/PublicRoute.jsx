import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] text-text-primary flex items-center justify-center p-4">
        <div className="flex items-center space-x-2.5 text-text-secondary bg-[#0E0E16] border border-white/10 px-4 py-2.5 rounded-xl shadow-glass">
          <Loader2 className="w-5 h-5 animate-spin text-brand-400" aria-hidden="true" />
          <span className="text-xs font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}