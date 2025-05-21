import React, { createContext, useContext, useState, useEffect } from "react";
import { Photo } from "../types";
import { useAuth } from "./AuthContext";
import { useToast } from "../hooks/useToast";
import Cookies from "js-cookie";
import useSWR, { mutate } from "swr";

interface PhotoContextType {
    photos: Photo[];
    loading: boolean;
    uploadPhoto: (file: File, title: string, description?: string) => Promise<boolean>;
    deletePhoto: (id: string) => void;
    restorePhoto: (id: string) => void;
    getDeletedPhotos: () => Photo[];
    getActivePhotos: () => Photo[];
    createShareLink: (photoId: string) => void;
    findPhotoById: (id: string) => Photo | undefined;
    emptyRecycleBin: () => void;
    fetchPhotos: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotos = () => {
    const context = useContext(PhotoContext);
    if (context === undefined) {
        throw new Error("usePhotos must be used within a PhotoProvider");
    }
    return context;
};

// Create a global fetcher function
const fetcher = async (url: string) => {
    const token = Cookies.get("token");
    if (!token) return [];
    
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch photos");
    }
    
    const data = await res.json();
    return data.photos || [];
};

// API URL constant
const API_URL = "https://v57gg0e6n4.execute-api.eu-central-1.amazonaws.com/prod/photos/";

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();
    
    // Use SWR for data fetching with a stable key
    const { data, error, mutate: refreshData } = useSWR(
        user ? API_URL : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 5000, // Avoid duplicate requests within 5 seconds
            onSuccess: (data) => {
                setPhotos(data);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        }
    );
    
    // Fetch photos automatically when user is authenticated
    useEffect(() => {
        if (user) {
            fetchPhotos();
        }
    }, [user]);

    // Function to manually trigger photo fetching
    const fetchPhotos = () => {
        if (user) {
            setLoading(true);
            refreshData();
        }
    };

    const uploadPhoto = async (file: File, title: string, description?: string): Promise<boolean> => {
        if (!user) return false;

        setLoading(true);

        const token = Cookies.get("token");
        const res = await fetch(`${API_URL}upload-url`, {
            method: "POST",
            body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
                title,
                description,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            setLoading(false);
            showToast("Failed to upload photo", "error");
            return false;
        }
        const { uploadUrl } = await res.json();
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });
        if (!uploadRes.ok) {
            setLoading(false);
            showToast("Failed to upload photo data", "error");
            return false;
        }
        
        // Refresh photos after upload
        refreshData();
        setLoading(false);
        return true;
    };

    const deletePhoto = async (id: string) => {
        const token = Cookies.get("token");

        const res = await fetch(`${API_URL}${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            refreshData();
            showToast("Photo moved to recycle bin", "info");
            return;
        }
        showToast("Unable to move photo to recycle bin", "info");
    };
    
    const emptyRecycleBin = async () => {
        const token = Cookies.get("token");
        setLoading(true);
        
        const res = await fetch(
            `${API_URL}recycle-bin/empty`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        
        setLoading(false);
        
        if (res.ok) {
            refreshData();
            showToast("Recycle bin emptied successfully", "success");
            return;
        }
        showToast("Unable to empty recycle bin", "error");
    };

    const restorePhoto = async (id: string) => {
        const token = Cookies.get("token");
        const res = await fetch(`${API_URL}${id}/restore`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            refreshData();
            showToast("Photo restored successfully", "success");
            return;
        }
        showToast("Photo restore unsuccessful", "error");
    };

    const getDeletedPhotos = () => {
        return photos.filter((photo) => photo.isDeleted);
    };

    const getActivePhotos = () => {
        return photos.filter((photo) => !photo.isDeleted);
    };

    const createShareLink = async (photoId: string) => {
        const token = Cookies.get("token");
        const res = await fetch(
            `${API_URL}${photoId}/share`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        if (!res.ok) {
            showToast("Unable to create share link", "error");
            return;
        }
        const { shareToken } = await res.json();
        const link = `${window.location.origin}/shared/${shareToken}`;
        navigator.clipboard
            .writeText(link)
            .then(() => {
                showToast("Share link created and copied to clipboard", "success");
            })
            .catch(() => {
                showToast("Could not copy to clipboard", "error");
            });
    };

    const findPhotoById = (id: string) => {
        return photos.find((photo) => photo.photoId === id);
    };

    return (
        <PhotoContext.Provider
            value={{
                photos,
                loading,
                uploadPhoto,
                deletePhoto,
                restorePhoto,
                getDeletedPhotos,
                getActivePhotos,
                createShareLink,
                findPhotoById,
                emptyRecycleBin,
                fetchPhotos,
            }}
        >
            {children}
        </PhotoContext.Provider>
    );
};