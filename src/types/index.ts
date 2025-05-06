// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Photo types
export interface Photo {
  id: string;
  url: string;
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
  type: 'success' | 'error' | 'info' | 'warning';
}