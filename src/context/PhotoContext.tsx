import React, { createContext, useContext, useState, useEffect } from "react";
import { Photo } from "../types";
import { useAuth } from "./AuthContext";
import { useToast } from "../hooks/useToast";
// import { format, addDays } from "date-fns";
import Cookies from "js-cookie";

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
                const response = await fetch("https://8frphsplx6.execute-api.eu-central-1.amazonaws.com/dev/photos", {
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
        }
    }, [user]);

    const uploadPhoto = async (file: File, title: string, description?: string): Promise<boolean> => {
        if (!user) return false;

        setLoading(true);

        const token = Cookies.get("token");
        console.log("Token:", token);
        console.log("File:", file);
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
            setLoading(false);
            showToast("Photo moved to recycle bin", "error");
            return false;
        }
        const { uploadUrl } = await res.json();
        console.log("Upload URL:", uploadUrl);
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });
        if (!uploadRes.ok) {
            setLoading(false);
            showToast("Photo moved to recycle bin", "error");
            return false;
        }
        showToast("Photo uploaded successfully", "success");
        return true;
    };

    const deletePhoto = async (id: string) => {
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
            showToast("Photo moved to recycle bin", "info");
            return;
        }
        showToast("Unable to move photo to recycle bin", "info");
    };

    const restorePhoto = async (id: string) => {
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
            showToast("Photo restored successfully", "success");
            return;
        }
        showToast("Photo restore unsuccessfull", "error");
    };

    const getDeletedPhotos = () => {
        return photos.filter((photo) => photo.isDeleted);
    };

    const getActivePhotos = () => {
        return photos.filter((photo) => !photo.isDeleted);
    };

    const createShareLink = async (photoId: string) => {
        const token = Cookies.get("token");
        console.log("Token:", token);
        // showToast("Share link created and copied to clipboard", "success");
        const res = await fetch(
            `https://8frphsplx6.execute-api.eu-central-1.amazonaws.com/dev/photos/${photoId}/share`,
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
            }}
        >
            {children}
        </PhotoContext.Provider>
    );
};
