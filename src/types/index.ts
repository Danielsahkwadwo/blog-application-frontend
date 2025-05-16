// Auth types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: "verified" | "unverified";
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    idToken: string;
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

// Photo types
export interface Photo {
    photoId: string;
    photoUrl: string;
    title: string;
    description?: string;
    uploadedAt: string;
    isDeleted: boolean;
    userId: string;
}

export interface ShareLink {
    id: string;
    photoId: string;
    expiresAt: string;
    url: string;
}

// Notification types
export interface Notification {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
}
