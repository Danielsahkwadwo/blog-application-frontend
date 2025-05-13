import React, { createContext, useContext, useState, useEffect } from "react";
import { LoginResponse, User } from "../types";
import Cookies from "js-cookie";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    confirmAccount: (email: string, token: string) => Promise<boolean>;
    requestPasswordReset: (email: string) => Promise<boolean>;
    resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to login: " + response.statusText);
            }

            const data: LoginResponse = await response.json();

            // Be sure idToken exists before setting it
            if (data.idToken) {
                Cookies.set("token", data.idToken);
            } else {
                console.warn("Login succeeded but no idToken in response");
            }

            if (data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                return true;
            }

            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get response body to help with debugging
                throw new Error(`Signup failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            return true;
        } catch (error) {
            console.error("Signup error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const confirmAccount = async (email: string, token: string): Promise<boolean> => {
        setLoading(true);

        const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/confirm-signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ confirmationCode: token, email }),
        });

        if (!response.ok) {
            throw new Error("Failed to confirm signup");
        }

        setLoading(false);
        return true;
    };

    const requestPasswordReset = async (email: string): Promise<boolean> => {
        setLoading(true);

        const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error("Failed to request password reset");
        }

        setLoading(false);
        return true;
    };

    const resetPassword = async (email: string, token: string, newPassword: string): Promise<boolean> => {
        setLoading(true);

        const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ confirmationCode: token, newPassword, email }),
        });

        if (!response.ok) {
            throw new Error("Failed to reset password");
        }

        setLoading(false);
        return true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                signup,
                logout,
                confirmAccount,
                requestPasswordReset,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
