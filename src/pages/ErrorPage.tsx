import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Camera, Sun, Moon, Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 404,
  title = "Page not found",
  message = "Sorry, we couldn't find the page you're looking for. The page might have been removed or the URL might be incorrect."
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };
  
  // Add page title and scroll to top
  useEffect(() => {
    document.title = `${statusCode} | ${title} | Photopia`;
    window.scrollTo(0, 0);
  }, [statusCode, title]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 max-w-lg w-full">
          <div className="relative mb-8">
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full animate-pulse delay-300"></div>
            {statusCode === 404 ? (
              <Camera className="h-16 w-16 text-primary-600 mx-auto relative z-10" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto relative z-10" />
            )}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 blur-xl opacity-20 dark:opacity-30 rounded-full transform -translate-y-1/2"></div>
            <h1 className="mt-8 text-9xl font-extrabold text-gray-900 dark:text-white sm:text-9xl tracking-tight relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                {statusCode}
              </span>
            </h1>
          </div>
          
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {message}
          </p>
          
          <div className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md inline-block">
            <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
              {location.pathname}
            </code>
          </div>
          
          <div className="mt-6 w-full max-w-md mx-auto h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 w-1/3 rounded-full"></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Trying to reconnect automatically...
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto w-full">
          <Button 
            onClick={goBack}
            variant="outline"
            icon={<ArrowLeft className="h-4 w-4 mr-2" />}
            className="w-full sm:w-auto"
          >
            Go back
          </Button>
          
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="w-full sm:w-auto">
            <Button
              icon={<Home className="h-4 w-4 mr-2" />}
              variant="gradient"
              className="w-full"
            >
              {isAuthenticated ? "Go to Dashboard" : "Go to Homepage"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            If you believe this is an error, please contact our support team.
          </p>
          <a 
            href="mailto:support@photopia.com" 
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            support@photopia.com
          </a>
        </div>
      </div>
      
      <footer className="py-8 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          {['facebook', 'twitter', 'instagram'].map((social) => (
            <a 
              key={social}
              href="#" 
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label={`${social} link`}
            >
              <span className="sr-only">{social}</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10z" />
              </svg>
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Photopia. All rights reserved.
        </p>
      </footer>
    </div>
  );
};