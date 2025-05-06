import React from 'react';
import { PhotoCard } from './PhotoCard';
import { Photo } from '../../types';

interface PhotoGridProps {
  photos: Photo[];
  isRecycleBin?: boolean;
  loading?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  isRecycleBin = false,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
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
        <h3 className="text-lg font-medium text-gray-900">No photos found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isRecycleBin
            ? "Your recycle bin is empty."
            : "Upload some photos to see them here."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.map(photo => (
        <div key={photo.id} className="h-full">
          <PhotoCard photo={photo} isRecycleBin={isRecycleBin} />
        </div>
      ))}
    </div>
  );
};