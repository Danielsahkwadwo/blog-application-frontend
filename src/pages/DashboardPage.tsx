import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PhotoGrid } from '../components/photos/PhotoGrid';
import { usePhotos } from '../context/PhotoContext';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { UploadCloud, RefreshCw, Grid, List } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { getActivePhotos, loading } = usePhotos();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const photos = getActivePhotos();

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Photos</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {photos.length} photos in your collection
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Link to="/upload">
              <Button 
                variant="primary"
                icon={<UploadCloud className="h-4 w-4" />}
              >
                Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-12">
          <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <PhotoGrid photos={photos} loading={loading} viewMode={viewMode} />
      )}
    </Layout>
  );
};