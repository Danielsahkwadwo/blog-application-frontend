import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Camera, Sun, Moon, ArrowLeft, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { isPasswordValid } from "../helpers";

interface ResetPasswordForm {
    email: string;
    resetToken: string;
    password: string;
    confirmPassword: string;
}

export const ResetPasswordPage: React.FC = () => {
    const [form, setForm] = useState<ResetPasswordForm>({
        email: "",
        resetToken: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<ResetPasswordForm>>({});
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: Partial<ResetPasswordForm> = {};

        if (!form.email) {
            newErrors.email = "Email is required";
        }

        if (!form.resetToken) {
            newErrors.resetToken = "Reset token is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (!isPasswordValid(form.password)) {
            newErrors.password = "Password needs 8+ chars, upper/lowercase, number, special char.";
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Call the resetPassword method from AuthContext

        const success = await resetPassword(form.email, form.resetToken, form.password);

        if (success) {
            setIsSubmitted(true);
            showToast("Password has been reset successfully", "success");
        } else {
            showToast("Failed to reset password. Please try again.", "error");
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

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
                    Create new password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Your new password must be different from previously used passwords
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
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    error={errors.email}
                                    fullWidth
                                    autoComplete="email"
                                    placeholder="Email address"
                                />

                                <Input
                                    id="resetToken"
                                    type="number"
                                    value={form.resetToken}
                                    onChange={(e) => setForm({ ...form, resetToken: e.target.value })}
                                    error={errors.resetToken}
                                    fullWidth
                                    autoComplete="reset-token"
                                    placeholder="Reset token"
                                />

                                <Input
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    error={errors.password}
                                    fullWidth
                                    autoComplete="new-password"
                                    placeholder="New password"
                                />

                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    error={errors.confirmPassword}
                                    fullWidth
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                />

                                <Button type="submit" fullWidth isLoading={isLoading}>
                                    Reset password
                                </Button>
                            </form>
                        </CardContent>
                    ) : (
                        <CardContent className="py-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                                <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Password reset successful
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Your password has been reset successfully.
                            </p>
                            <div className="mt-6">
                                <Button onClick={() => navigate("/login")} fullWidth>
                                    Sign in with new password
                                </Button>
                            </div>
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
