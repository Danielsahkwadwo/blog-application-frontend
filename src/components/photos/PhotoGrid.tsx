import React, { useState } from 'react';
import { PhotoCard } from './PhotoCard';
import { Photo } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Download, Share2, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePhotos } from '../../context/PhotoContext';
import { DeleteConfirmation } from '../ui/DeleteConfirmation';

interface PhotoGridProps {
  photos: Photo[];
  isRecycleBin?: boolean;
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  isRecycleBin = false,
  loading = false,
  viewMode = 'grid'
}) => {
  const { deletePhoto, restorePhoto, createShareLink } = usePhotos();
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDeleteClick = (photoId: string) => {
    setPhotoToDelete(photoId);
    setShowDeleteConfirmation(true);
    console.log("Delete clicked for photo:", photoId); // Debug log
  };

  const handleConfirmDelete = () => {
    console.log("Confirm delete for photo:", photoToDelete); // Debug log
    if (photoToDelete) {
      deletePhoto(photoToDelete);
      setPhotoToDelete(null);
      setShowDeleteConfirmation(false); // Ensure dialog is closed after confirmation
    }
  };

  const handleCancelDelete = () => {
    console.log("Cancel delete"); // Debug log
    setShowDeleteConfirmation(false);
    setPhotoToDelete(null);
  };

  const handleRestore = (photoId: string) => {
    restorePhoto(photoId);
  };

  const handleShare = (photoId: string) => {
    createShareLink(photoId, 7); // 7 days expiration
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={viewMode === 'grid' ? 
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" :
        "space-y-4"
      }>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`${
            viewMode === 'grid' 
              ? 'bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square'
              : 'h-24 bg-gray-200 dark:bg-gray-700 rounded-lg'
          } animate-pulse`} />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No photos found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isRecycleBin
            ? "Your recycle bin is empty."
            : "Upload some photos to see them here."}
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className="space-y-4">
          {photos.map(photo => (
            <div key={photo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center p-4">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-20 w-20 object-cover rounded-lg cursor-pointer"
                  onClick={() => document.getElementById(`photo-preview-${photo.id}`)?.click()}
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{photo.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded {formatDistanceToNow(new Date(photo.uploadedAt))} ago
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!isRecycleBin ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Download className="h-4 w-4" />}
                        onClick={() => handleDownload(photo)}
                        className="text-gray-700 dark:text-gray-200"
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Share2 className="h-4 w-4" />}
                        onClick={() => handleShare(photo.id)}
                        className="text-gray-700 dark:text-gray-200"
                      >
                        Share
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Delete button clicked in list view");
                          handleDeleteClick(photo.id);
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<RefreshCw className="h-4 w-4" />}
                      onClick={() => handleRestore(photo.id)}
                    >
                      Restore
                    </Button>
                  )}
                </div>
                {/* Hidden button for PhotoCard to handle preview */}
                <button
                  id={`photo-preview-${photo.id}`}
                  className="hidden"
                  onClick={() => {
                    const photoCard = document.querySelector(`[data-photo-id="${photo.id}"]`);
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
            isOpen={true}
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
        {photos.map(photo => (
          <div key={photo.id} className="h-full" data-photo-id={photo.id}>
            <PhotoCard 
              photo={photo} 
              isRecycleBin={isRecycleBin} 
              onDeleteClick={handleDeleteClick}
            />
          </div>
        ))}
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmation
          isOpen={true}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Photo"
          message="Are you sure you want to delete this photo? It will be moved to the recycle bin."
        />
      )}
    </>
  );
};