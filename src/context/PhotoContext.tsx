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
    deletePhoto: (id: string) => Promise<boolean>;
    restorePhoto: (id: string) => Promise<boolean>;
    getDeletedPhotos: () => Photo[];
    getActivePhotos: () => Photo[];
    createShareLink: (photoId: string, expirationDays: number) => ShareLink;
    getShareLinks: () => ShareLink[];
    findPhotoById: (id: string) => Photo | undefined;
    refreshPhotos: () => Promise<void>;
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

    // Function to fetch photos from API
    const fetchPhotos = async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            const token = Cookies.get("token");
            console.log("Token:", token);
            const response = await fetch("https://8frphsplx6.execute-api.eu-central-1.amazonaws.com/dev/photos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Photos data:", data.photos);
                setPhotos(data.photos);
            } else {
                console.error("Failed to fetch photos:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load photos when user changes
    useEffect(() => {
        if (user) {
            fetchPhotos();
        }
    }, [user]);

    // Function to refresh photos
    const refreshPhotos = async () => {
        await fetchPhotos();
    };

    const uploadPhoto = async (file: File, title: string, description?: string): Promise<boolean> => {
        if (!user) return false;

        setLoading(true);

        try {
            const token = Cookies.get("token");
            console.log("Token:", token);
            const res = await fetch(`https://8frphsplx6.execute-api.eu-central-1.amazonaws.com/dev/photos/upload-url`, {
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
                showToast("Failed to upload photo", "error");
                return false;
            }
            
            const { uploadUrl } = await res.json();
            console.log("Upload URL:", uploadUrl);
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            });
            
            if (!uploadRes.ok) {
                showToast("Failed to upload photo", "error");
                return false;
            }

            // Refresh photos after successful upload
            await refreshPhotos();
            showToast("Photo uploaded successfully", "success");
            return true;
        } catch (error) {
            console.error("Error uploading photo:", error);
            showToast("Failed to upload photo", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deletePhoto = async (id: string): Promise<boolean> => {
        try {
            const token = Cookies.get("token");
            console.log("Token:", token);
            const res = await fetch(`https://8frphsplx6.execute-api.eu-central-1.amazonaws.com/dev/photos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (res.ok) {
                // Update local state to reflect the deletion
                setPhotos(prevPhotos => 
                    prevPhotos.map(photo => 
                        photo.photoId === id ? { ...photo, isDeleted: true } : photo
                    )
                );
                
                showToast("Photo moved to recycle bin", "info");
                return true;
            } else {
                showToast("Unable to move photo to recycle bin", "error");
                return false;
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
            showToast("Unable to move photo to recycle bin", "error");
            return false;
        }
    };

    const restorePhoto = async (id: string): Promise<boolean> => {
        try {
            const token = Cookies.get("token");
            console.log("Token:", token);
            const res = await fetch(`https://8frphsplx6.execute-api.eu-central-1.amazonaws.com/dev/photos/${id}/restore`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (res.ok) {
                // Update local state to reflect the restoration
                setPhotos(prevPhotos => 
                    prevPhotos.map(photo => 
                        photo.photoId === id ? { ...photo, isDeleted: false } : photo
                    )
                );
                
                showToast("Photo restored successfully", "success");
                return true;
            } else {
                showToast("Photo restore unsuccessful", "error");
                return false;
            }
        } catch (error) {
            console.error("Error restoring photo:", error);
            showToast("Photo restore unsuccessful", "error");
            return false;
        }
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
                refreshPhotos,
            }}
        >
            {children}
        </PhotoContext.Provider>
    );
};