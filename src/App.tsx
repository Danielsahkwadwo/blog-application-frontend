import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PhotoProvider } from "./context/PhotoContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UploadPage } from "./pages/UploadPage";
import { RecycleBinPage } from "./pages/RecycleBinPage";
import { SharedPhotoPage } from "./pages/SharedPhotoPage";
import { LandingPage } from "./pages/LandingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ErrorPage } from "./pages/ErrorPage";
import { ConfirmAccount } from "./pages/ConfirmAccount";

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

// Routes with authentication wrapper
const AuthenticatedRoutes = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? (
        <PhotoProvider>
            <Routes>
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
                <Route path="/upload" element={<ProtectedRoute element={<UploadPage />} />} />
                <Route path="/recycle-bin" element={<ProtectedRoute element={<RecycleBinPage />} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </PhotoProvider>
    ) : null;
};

// Public routes
const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/confirm-account" element={<ConfirmAccount />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/shared/:id" element={<SharedPhotoPage />} />
            <Route path="/404" element={<ErrorPage />} />
            <Route
                path="/error"
                element={
                    <ErrorPage
                        statusCode={500}
                        title="Server Error"
                        message="Something went wrong on our end. Please try again later or contact support if the problem persists."
                    />
                }
            />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return <>{isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />}</>;
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <ErrorBoundary>
                            <AppRoutes />
                        </ErrorBoundary>
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
