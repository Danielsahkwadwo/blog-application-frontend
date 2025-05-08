import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PhotoGrid } from '../components/photos/PhotoGrid';
import { usePhotos } from '../context/PhotoContext';
import { RefreshCw, Trash2 } from 'lucide-react';

export const RecycleBinPage: React.FC = () => {
  const { getDeletedPhotos, loading } = usePhotos();
  const deletedPhotos = getDeletedPhotos();

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center">
          <Trash2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recycle Bin</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {deletedPhotos.length} items in your recycle bin
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-12">
          <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <PhotoGrid photos={deletedPhotos} isRecycleBin={true} />
      )}
    </Layout>
  );
};