import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PhotoProvider } from './context/PhotoContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { RecycleBinPage } from './pages/RecycleBinPage';
import { SharedPhotoPage } from './pages/SharedPhotoPage';
import { LandingPage } from './pages/LandingPage';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
      <Route path="/upload" element={<ProtectedRoute element={<UploadPage />} />} />
      <Route path="/recycle-bin" element={<ProtectedRoute element={<RecycleBinPage />} />} />
      <Route path="/shared/:id" element={<SharedPhotoPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <PhotoProvider>
            <AppRoutes />
          </PhotoProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;