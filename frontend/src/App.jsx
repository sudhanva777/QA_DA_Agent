import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThreeSceneProvider, ThreeSceneCanvas } from './context/ThreeSceneContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PublicRoute from './components/Auth/PublicRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <ThreeSceneProvider>
        <ThreeSceneCanvas />
        <Router>
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0E0E16',
              color: '#F5F5F7',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#0E0E16',
              },
            },
            error: {
              iconTheme: {
                primary: '#F43F5E',
                secondary: '#0E0E16',
              },
            },
          }}
        />
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThreeSceneProvider>
  </AuthProvider>
);
}