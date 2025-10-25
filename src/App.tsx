// src/App.tsx

// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import RoomDetail from './pages/rooms/RoomDetail';
import RoomEdit from './pages/rooms/RoomEdit';
import RoomCreate from './pages/rooms/RoomCreate';
import RoomList from './pages/rooms/RoomList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/rooms" 
            element={
              <ProtectedRoute>
                <RoomList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rooms/create" 
            element={
              <ProtectedRoute>
                <RoomCreate/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rooms/:id" 
            element={
              <ProtectedRoute>
                <RoomDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rooms/:id/edit" 
            element={
              <ProtectedRoute>
                <RoomEdit />
              </ProtectedRoute>
            } 
          />
          

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;