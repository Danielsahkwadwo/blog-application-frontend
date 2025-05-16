import React, { useState } from "react";
import { PhotoCard } from "./PhotoCard";
import { Photo } from "../../types";
import { formatDistanceToNow } from "date-fns";
import { Download, Share2, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { usePhotos } from "../../context/PhotoContext";
import { DeleteConfirmation } from "../ui/DeleteConfirmation";

interface PhotoGridProps {
    photos: Photo[];
    isRecycleBin?: boolean;
    loading?: boolean;
    viewMode?: "grid" | "list";
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
    photos,
    isRecycleBin = false,
    loading = false,
    viewMode = "grid",
}) => {
    const { deletePhoto, restorePhoto, createShareLink } = usePhotos();
    const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleDeleteClick = (photoId: string) => {
        setPhotoToDelete(photoId);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        console.log("Deleting photo with ID:", photoToDelete);
        if (photoToDelete) {
            deletePhoto(photoToDelete);
            setPhotoToDelete(null);
            setShowDeleteConfirmation(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setPhotoToDelete(null);
    };

    const handleRestore = (photoId: string) => {
        restorePhoto(photoId);
    };

    const handleShare = (photoId: string) => {
        createShareLink(photoId); // 7 days expiration
    };

    const handleDownload = (photo: Photo) => {
        const link = document.createElement("a");
        link.href = photo.photoUrl;
        link.download = `${photo.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        : "space-y-4"
                }
            >
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`${
                            viewMode === "grid"
                                ? "bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"
                                : "h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
                        } animate-pulse`}
                    />
                ))}
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary-50 dark:bg-primary-900/30 rounded-full p-6 mb-6">
                    <ImageIcon className="h-12 w-12 text-primary-500 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No photos found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    {isRecycleBin
                        ? "Your recycle bin is empty. Deleted photos will appear here."
                        : "Upload some photos to start building your collection."}
                </p>
                {!isRecycleBin && (
                    <Button
                        variant="gradient"
                        className="mt-6"
                        icon={<ImageIcon className="h-4 w-4 mr-2" />}
                        onClick={() => (window.location.href = "/upload")}
                    >
                        Upload Your First Photo
                    </Button>
                )}
            </div>
        );
    }

    if (viewMode === "list") {
        return (
            <>
                <div className="space-y-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.photoId}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                                <div className="relative group">
                                    <img
                                        src={photo.photoUrl}
                                        alt={photo.title}
                                        className="h-24 w-24 sm:h-20 sm:w-20 object-cover rounded-lg cursor-pointer"
                                        onClick={() =>
                                            document.getElementById(`photo-preview-${photo.photoId}`)?.click()
                                        }
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-white"
                                            onClick={() =>
                                                document.getElementById(`photo-preview-${photo.photoId}`)?.click()
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>

                                <div className="ml-0 sm:ml-4 mt-3 sm:mt-0 flex-grow">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{photo.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Uploaded {formatDistanceToNow(new Date(photo.uploadedAt))} ago
                                    </p>
                                    {photo.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                                            {photo.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                                    {!isRecycleBin ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={<Download className="h-4 w-4" />}
                                                onClick={() => handleDownload(photo)}
                                                className="text-gray-700 dark:text-gray-200"
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={<Share2 className="h-4 w-4" />}
                                                onClick={() => handleShare(photo.photoId)}
                                                className="text-gray-700 dark:text-gray-200"
                                            >
                                                Share
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={<Trash2 className="h-4 w-4" />}
                                                onClick={() => handleDeleteClick(photo.photoId)}
                                                className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={<RefreshCw className="h-4 w-4" />}
                                            onClick={() => handleRestore(photo.photoId)}
                                            className="text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-900/30 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                        >
                                            Restore
                                        </Button>
                                    )}
                                </div>

                                {/* Hidden button for PhotoCard to handle preview */}
                                <button
                                    id={`photo-preview-${photo.photoId}`}
                                    className="hidden"
                                    onClick={() => {
                                        const photoCard = document.querySelector(`[data-photo-id="${photo.photoId}"]`);
                                        if (photoCard) {
                                            (photoCard as HTMLElement).click();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {showDeleteConfirmation && (
                    <DeleteConfirmation
                        onClose={handleCancelDelete}
                        onConfirm={handleConfirmDelete}
                        title="Delete Photo"
                        message="Are you sure you want to delete this photo? It will be moved to the recycle bin."
                    />
                )}
            </>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <div key={photo.photoId} className="h-full" data-photo-id={photo.photoId}>
                        <PhotoCard photo={photo} isRecycleBin={isRecycleBin} onDeleteClick={handleDeleteClick} />
                    </div>
                ))}
            </div>

            {showDeleteConfirmation && (
                <DeleteConfirmation
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Photo"
                    message="Are you sure you want to delete this photo? It will be moved to the recycle bin."
                />
            )}
        </>
    );
};
