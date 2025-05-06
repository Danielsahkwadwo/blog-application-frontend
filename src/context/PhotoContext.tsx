import React, { createContext, useContext, useState, useEffect } from 'react';
import { Photo, ShareLink } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/useToast';
import { format, addDays } from 'date-fns';

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
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};

// Sample photos for demo
const SAMPLE_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg',
    title: 'Mountain Landscape',
    description: 'Beautiful mountain view at sunset',
    uploadedAt: '2023-09-15T10:30:00Z',
    isDeleted: false,
    userId: '1',
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
    title: 'Beach Sunset',
    description: 'Relaxing sunset at the beach',
    uploadedAt: '2023-10-05T14:20:00Z',
    isDeleted: false,
    userId: '1',
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg',
    title: 'City Lights',
    description: 'Night view of city skyline',
    uploadedAt: '2023-08-22T20:15:00Z',
    isDeleted: false,
    userId: '1',
  },
  {
    id: '4',
    url: 'https://images.pexels.com/photos/37833/rainbow-lake-boats-iceland-37833.jpeg',
    title: 'Rainbow Lake',
    description: 'Colorful view over a peaceful lake',
    uploadedAt: '2023-07-11T09:45:00Z',
    isDeleted: true,
    userId: '1',
  },
];

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
      const loadPhotos = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setPhotos(SAMPLE_PHOTOS);
        setLoading(false);
      };
      
      loadPhotos();
    } else {
      setPhotos([]);
    }
  }, [user]);

  const uploadPhoto = async (file: File, title: string, description?: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we would upload to storage service
    // and get back a URL
    const fakeUrl = URL.createObjectURL(file);
    
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: fakeUrl,
      title,
      description,
      uploadedAt: new Date().toISOString(),
      isDeleted: false,
      userId: user.id,
    };
    
    setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
    setLoading(false);
    showToast('Photo uploaded successfully', 'success');
    return true;
  };

  const deletePhoto = (id: string) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === id ? { ...photo, isDeleted: true } : photo
      )
    );
    showToast('Photo moved to recycle bin', 'info');
  };

  const restorePhoto = (id: string) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === id ? { ...photo, isDeleted: false } : photo
      )
    );
    showToast('Photo restored successfully', 'success');
  };

  const getDeletedPhotos = () => {
    return photos.filter(photo => photo.isDeleted);
  };

  const getActivePhotos = () => {
    return photos.filter(photo => !photo.isDeleted);
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
    
    setShareLinks(prev => [...prev, newShareLink]);
    showToast('Share link created and copied to clipboard', 'success');
    
    // Copy to clipboard
    navigator.clipboard.writeText(newShareLink.url).catch(() => {
      // Fallback if clipboard API fails
      showToast('Could not copy to clipboard', 'error');
    });
    
    return newShareLink;
  };

  const getShareLinks = () => shareLinks;

  const findPhotoById = (id: string) => {
    return photos.find(photo => photo.id === id);
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