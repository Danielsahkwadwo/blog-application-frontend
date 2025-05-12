import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Camera, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ConfirmAccount: React.FC = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { loading, confirmAccount } = useAuth();
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!code) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const success = await confirmAccount(email, code);

        if (success) {
            showToast("Account has been confirmed", "success");
            navigate("/login");
        } else {
            showToast("Invalid email or password", "error");
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
                    Account Confirmation
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Or{" "}
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
                                autoFocus={true}
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                fullWidth
                                placeholder="Email address"
                                autoComplete="email"
                            />

                            <Input
                                id="Confirmation code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                error={errors.password}
                                fullWidth
                                placeholder="Confirmation Code"
                                autoComplete="current-password"
                            />

                            <Button type="submit" fullWidth isLoading={loading}>
                                Sign in
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
