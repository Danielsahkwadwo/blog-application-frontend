import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";
import { Menu, X, Camera, User, LogOut, Sun, Moon } from "lucide-react";

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { to: "/dashboard", label: "Gallery", authRequired: true },
        { to: "/upload", label: "Upload", authRequired: true },
        { to: "/recycle-bin", label: "Recycle Bin", authRequired: true },
    ];

    return (
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <Camera className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-dark-900 dark:text-white">Photopia</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {isAuthenticated && (
                            <>
                                {navItems
                                    .filter((item) => !item.authRequired || isAuthenticated)
                                    .map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                location.pathname === item.to
                                                    ? "text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                                                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                <div className="ml-4 flex items-center">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">
                                        Hello, {user?.firstName}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        icon={<LogOut className="h-4 w-4" />}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 animate-fadeIn shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated && (
                            <>
                                {navItems
                                    .filter((item) => !item.authRequired || isAuthenticated)
                                    .map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                location.pathname === item.to
                                                    ? "text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50"
                                                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <User className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 p-1 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                                {user?.name}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
