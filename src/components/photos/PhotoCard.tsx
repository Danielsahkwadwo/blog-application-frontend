import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  MoreVertical, 
  Trash2, 
  Share2, 
  Download, 
  RefreshCw,
  X
} from 'lucide-react';
import { usePhotos } from '../../context/PhotoContext';
import { format } from 'date-fns';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  isRecycleBin?: boolean;
  onDeleteClick?: (photoId: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ 
  photo, 
  isRecycleBin = false,
  onDeleteClick
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { deletePhoto, restorePhoto, createShareLink } = usePhotos();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(photo.id);
    } else {
      deletePhoto(photo.id);
    }
    setShowMenu(false);
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    restorePhoto(photo.id);
    setShowMenu(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    createShareLink(photo.id, 7); // 7 days expiration
    setShowMenu(false);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = photo.url;
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
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <>
      <Card 
        className="group h-full transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={() => setShowPreview(true)}
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
            src={photo.url}
            alt={photo.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-medium truncate">{photo.title}</h3>
              <p className="text-white/80 text-sm">
                {formatDate(photo.uploadedAt)}
              </p>
            </div>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white text-gray-700 rounded-full h-8 w-8 p-0"
              onClick={handleMenuToggle}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 animate-slideUp">
                {!isRecycleBin ? (
                  <>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </button>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </button>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleRestore}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Restore
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Full-screen preview modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="relative max-w-7xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 text-white hover:text-white/80 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(false);
              }}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={photo.url}
              alt={photo.title}
              className="max-h-[90vh] w-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <h2 className="text-white text-xl font-medium">{photo.title}</h2>
              {photo.description && (
                <p className="text-white/80 mt-1">{photo.description}</p>
              )}
              <p className="text-white/60 text-sm mt-1">
                Uploaded on {formatDate(photo.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};