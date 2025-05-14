import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Camera, Sun, Moon, ArrowLeft, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ email?: string }>({});
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const { loading, requestPasswordReset } = useAuth();

    const validateForm = () => {
        const newErrors: { email?: string } = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Call the requestPasswordReset method from AuthContext
        const success = await requestPasswordReset(email);

        if (success) {
            setIsSubmitted(true);
            showToast("Password reset link sent to your email", "success");
        } else {
            showToast("Email not found. Please check your email address.", "error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
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
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    {!isSubmitted ? (
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    autoFocus={true}
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={errors.email}
                                    fullWidth
                                    autoComplete="email"
                                    placeholder="Email address"
                                />

                                <Button type="submit" fullWidth isLoading={loading}>
                                    Send reset link
                                </Button>
                            </form>
                        </CardContent>
                    ) : (
                        <CardContent className="py-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                                <Mail className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Check your email</h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                We've sent a password reset link to {email}
                            </p>
                            {/* continue to reset password */}
                            <Link
                                to="/reset-password"
                                className="underline mt-4 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                            >
                                Continue to reset password
                            </Link>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                                >
                                    try again
                                </button>
                            </p>
                        </CardContent>
                    )}

                    <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="w-full flex justify-center">
                            <Link
                                to="/login"
                                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
