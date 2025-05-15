import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { MoreVertical, Trash2, Share2, Download, RefreshCw, X, Heart, Info } from "lucide-react";
import { usePhotos } from "../../context/PhotoContext";
import { format } from "date-fns";
import { Photo } from "../../types";

interface PhotoCardProps {
    photo: Photo;
    isRecycleBin?: boolean;
    onDeleteClick?: (photoId: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, isRecycleBin = false, onDeleteClick }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { deletePhoto, restorePhoto, createShareLink } = usePhotos();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDeleteClick) {
            onDeleteClick(photo.photoId);
        } else {
            deletePhoto(photo.photoId);
        }
        setShowMenu(false);
    };

    const handleRestore = (e: React.MouseEvent) => {
        e.stopPropagation();
        restorePhoto(photo.photoId);
        setShowMenu(false);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        createShareLink(photo.photoId); // 7 days expiration
        setShowMenu(false);
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = photo.photoUrl;
        link.download = `${photo.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setShowMenu(false);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy");
    };

    const toggleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    return (
        <>
            <Card
                className="group h-full transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
                onClick={() => setShowPreview(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowPreview(true);
                    }}
                >
                    {!isImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <img
                        src={photo.photoUrl}
                        alt={photo.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : "scale-100"}`}
                        onLoad={() => setIsImageLoaded(true)}
                    />

                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-medium truncate">{photo.title}</h3>
                            <p className="text-white/80 text-sm">{formatDate(photo.uploadedAt)}</p>
                        </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        {!isRecycleBin && (
                            <>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="bg-white/90 hover:bg-white text-gray-700 rounded-full h-10 w-10 p-0"
                                    onClick={toggleLike}
                                >
                                    <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="bg-white/90 hover:bg-white text-gray-700 rounded-full h-10 w-10 p-0"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white/90 hover:bg-white text-gray-700 rounded-full h-10 w-10 p-0"
                            onClick={handleMenuToggle}
                        >
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>

                    {showMenu && (
                        <div className="absolute right-3 top-14 mt-1 w-52 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10 animate-slideUp">
                            {!isRecycleBin ? (
                                <>
                                    <button
                                        className="flex w-full items-center px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={handleDownload}
                                    >
                                        <Download className="mr-2 h-5 w-5" /> Download
                                    </button>
                                    <button
                                        className="flex w-full items-center px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPreview(true);
                                        }}
                                    >
                                        <Info className="mr-2 h-5 w-5" /> Details
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                    <button
                                        className="flex w-full items-center px-4 py-3 text-base text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-5 w-5" /> Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="flex w-full items-center px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={handleRestore}
                                >
                                    <RefreshCw className="mr-2 h-5 w-5" /> Restore
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Full-screen preview modal */}
            {showPreview && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setShowPreview(false)}
                >
                    <div className="relative max-w-7xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 text-white hover:text-white/80 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPreview(false);
                            }}
                        >
                            <X className="h-7 w-7" />
                        </Button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-grow">
                                <img
                                    src={photo.photoUrl}
                                    alt={photo.title}
                                    className="max-h-[80vh] w-full object-contain rounded-lg"
                                />
                            </div>

                            <div className="w-full md:w-80 bg-white/10 backdrop-blur-md p-6 rounded-lg text-white">
                                <h2 className="text-xl font-bold mb-2">{photo.title}</h2>
                                {photo.description && <p className="text-white/80 mb-4">{photo.description}</p>}

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">
                                            Uploaded
                                        </h3>
                                        <p>{formatDate(photo.uploadedAt)}</p>
                                    </div>

                                    <div className="border-t border-white/20 pt-4">
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">
                                            Actions
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-white/20 text-white hover:bg-white/10"
                                                icon={<Download className="h-5 w-5 mr-1" />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(e);
                                                }}
                                            >
                                                Download
                                            </Button>
                                            {!isRecycleBin && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/20 text-white hover:bg-white/10"
                                                    icon={<Share2 className="h-5 w-5 mr-1" />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(e);
                                                    }}
                                                >
                                                    Share
                                                </Button>
                                            )}
                                            {!isRecycleBin ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/20 text-white hover:bg-white/10"
                                                    icon={<Trash2 className="h-5 w-5 mr-1" />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(e);
                                                        setShowPreview(false);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/20 text-white hover:bg-white/10"
                                                    icon={<RefreshCw className="h-5 w-5 mr-1" />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRestore(e);
                                                        setShowPreview(false);
                                                    }}
                                                >
                                                    Restore
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
