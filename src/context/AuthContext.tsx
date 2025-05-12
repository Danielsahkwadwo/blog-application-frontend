import React, { createContext, useContext, useState, useEffect } from "react";
import { LoginResponse, User } from "../types";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    confirmAccount: (email: string, token: string) => Promise<boolean>;
    requestPasswordReset: (email: string) => Promise<boolean>;
    resetPassword: (token: string, newPassword: string) => Promise<boolean>;
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

        // make request
        const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const data: LoginResponse = await response.json();
        const { user } = data;

        if (user) {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            setLoading(false);
            return true;
        }

        setLoading(false);
        return false;
    };

    const signup = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);

        // make request
        const response = await fetch("https://v36p1m6iza.execute-api.eu-central-1.amazonaws.com/dev/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (!response.ok) {
            throw new Error("Signup failed, try again");
        }

        setLoading(false);
        return true;
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

        // Simulate API request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if email exists
        const userExists = MOCK_USERS.some((u) => u.email === email);

        setLoading(false);

        // In a real app, we would send a reset email if the user exists
        // For demo purposes, we'll just return whether the email exists
        return userExists;
    };

    const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
        setLoading(true);

        // Simulate API request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real app, we would validate the token and update the password in the database
        // For demo purposes, we'll just simulate success (unless token contains 'invalid')
        const isValidToken = !token.includes("invalid");

        setLoading(false);
        return isValidToken;
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
