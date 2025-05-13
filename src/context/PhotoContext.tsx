import React, { createContext, useContext, useState, useEffect } from "react";
import { Photo, ShareLink } from "../types";
import { useAuth } from "./AuthContext";
import { useToast } from "../hooks/useToast";
import { format, addDays } from "date-fns";
import Cookies from "js-cookie";

interface PhotoContextType {
    photos: Photo[];
    loading: boolean;
    uploadPhoto: (file: File, title: string, description?: string) => Promise<boolean>;
    deletePhoto: (id: string) => void;
    restorePhoto: (id: string) => void;
    getDeletedPhotos: () => Photo[];
    getActivePhotos: () => Photo[];
    createShareLink: (photoId: string, expirationDays: number) => ShareLink;
    getShareLinks: () => ShareLink[];
    findPhotoById: (id: string) => Photo | undefined;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotos = () => {
    const context = useContext(PhotoContext);
    if (context === undefined) {
        throw new Error("usePhotos must be used within a PhotoProvider");
    }
    return context;
};

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();

    // Load photos when user changes
    useEffect(() => {
        if (user) {
            // In a real app, fetch photos from API
            // For demo, use mock data with a delay
            const fetchPhotos = async () => {
                setLoading(true);
                const token = Cookies.get("token");
                console.log("Token:", token);
                const response = await fetch("https://mxaa8mgru7.execute-api.eu-central-1.amazonaws.com/dev/photos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }); // Replace with actual API call
                const data = await response.json();
                console.log("Photos data:", data.photos);
                setPhotos(data.photos);

                setLoading(false);
            };
            fetchPhotos();
        } else {
            setPhotos([]);
        }
    }, [user]);

    const uploadPhoto = async (file: File, title: string, description?: string): Promise<boolean> => {
        if (!user) return false;

        setLoading(true);

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        showToast("Photo uploaded successfully", "success");
        return true;
    };

    const deletePhoto = (id: string) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) => (photo.photoId === id ? { ...photo, isDeleted: true } : photo)),
        );
        showToast("Photo moved to recycle bin", "info");
    };

    const restorePhoto = (id: string) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) => (photo.photoId === id ? { ...photo, isDeleted: false } : photo)),
        );
        showToast("Photo restored successfully", "success");
    };

    const getDeletedPhotos = () => {
        return photos.filter((photo) => photo.isDeleted);
    };

    const getActivePhotos = () => {
        return photos.filter((photo) => !photo.isDeleted);
    };

    const createShareLink = (photoId: string, expirationDays = 7): ShareLink => {
        const expiresAt = addDays(new Date(), expirationDays).toISOString();
        const linkId = `share-${Date.now()}`;

        const newShareLink: ShareLink = {
            id: linkId,
            photoId,
            expiresAt,
            url: `${window.location.origin}/shared/${linkId}`,
        };

        setShareLinks((prev) => [...prev, newShareLink]);
        showToast("Share link created and copied to clipboard", "success");

        // Copy to clipboard
        navigator.clipboard.writeText(newShareLink.url).catch(() => {
            // Fallback if clipboard API fails
            showToast("Could not copy to clipboard", "error");
        });

        return newShareLink;
    };

    const getShareLinks = () => shareLinks;

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
                getShareLinks,
                findPhotoById,
            }}
        >
            {children}
        </PhotoContext.Provider>
    );
};
