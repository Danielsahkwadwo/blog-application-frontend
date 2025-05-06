import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Image, AlertCircle } from 'lucide-react';
import { usePhotos } from '../../context/PhotoContext';

export const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadPhoto } = usePhotos();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      
      // Auto-set the title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.split('.')[0];
        setTitle(fileName.replace(/[_-]/g, ' '));
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) return;
    
    setUploading(true);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return newProgress;
      });
    }, 100);
    
    // Upload the photo
    const success = await uploadPhoto(file, title, description);
    
    // Complete the progress bar
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    setTimeout(() => {
      setUploading(false);
      if (success) {
        navigate('/dashboard');
      }
    }, 500);
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Upload a Photo</h2>
        <p className="text-gray-500 mt-1">Share your moments with the world</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              
              {preview ? (
                <div className="relative max-h-96 overflow-hidden rounded-md">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-96 object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white/100 text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    {isDragActive ? (
                      <Image className="h-12 w-12 text-primary-500" />
                    ) : (
                      <Upload className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="text-lg font-medium">
                    {isDragActive
                      ? 'Drop your image here'
                      : 'Drag & drop an image or click to browse'}
                  </div>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG and GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <Input
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your photo"
            required
          />
          
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
            />
          </div>
          
          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || !title || uploading}
              isLoading={uploading}
              icon={<Upload className="h-4 w-4" />}
            >
              Upload Photo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};