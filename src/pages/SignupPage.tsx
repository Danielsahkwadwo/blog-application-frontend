import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Camera, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { isPasswordValid } from "../helpers";

export const SignupPage: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const { signup, loading } = useAuth();
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!firstName) {
            newErrors.firstName = "First name is required";
        }

        if (!lastName) {
            newErrors.lastName = "Last name is required";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (!isPasswordValid(password)) {
            newErrors.password = "Password needs 8+ chars, upper/lowercase, number, special char.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const fullName = `${firstName} ${lastName}`.trim();
        const success = await signup(fullName, email, password);

        if (success) {
            showToast("Account created successfully", "success");
            navigate("/dashboard");
        } else {
            showToast("Email already in use", "error");
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
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Or{" "}
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardContent className="py-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    autoFocus={true}
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    error={errors.firstName}
                                    fullWidth
                                    placeholder="First name"
                                    autoComplete="given-name"
                                />

                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    error={errors.lastName}
                                    fullWidth
                                    autoComplete="family-name"
                                />
                            </div>

                            <Input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                fullWidth
                                autoComplete="email"
                            />

                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                                fullWidth
                                autoComplete="new-password"
                            />

                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={errors.confirmPassword}
                                fullWidth
                                autoComplete="new-password"
                            />

                            <div>
                                <Button type="submit" fullWidth isLoading={loading}>
                                    Create account
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
