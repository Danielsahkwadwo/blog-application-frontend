import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { Camera, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await login(email, password);
    
    if (success) {
      showToast('Successfully logged in', 'success');
      navigate('/dashboard');
    } else {
      showToast('Invalid email or password', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Camera className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                fullWidth
                autoComplete="email"
              />

              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={loading}
              >
                Sign in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center w-full">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Demo credentials: <span className="font-medium">demo@example.com</span> / <span className="font-medium">password123</span>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};