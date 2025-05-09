import React, { useState, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Upload, Image, AlertTriangle, X, Check, ArrowLeft, Camera } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { useToast } from '../hooks/useToast';

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<'select' | 'details' | 'uploading' | 'complete'>('select');
  const { uploadPhoto } = usePhotos();
  const { showToast } = useToast();
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
      
      // Move to the details step
      setUploadStep('details');
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
    setUploadStep('uploading');
    
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
        setUploadStep('complete');
        showToast('Photo uploaded successfully', 'success');
      } else {
        showToast('Failed to upload photo', 'error');
      }
    }, 500);
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setUploadStep('select');
  };

  const renderUploadStep = () => {
    switch (uploadStep) {
      case 'select':
        return (
          <div className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  {isDragActive ? (
                    <Image className="h-16 w-16 text-primary-500" />
                  ) : (
                    <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div className="text-xl font-medium text-gray-900 dark:text-white">
                  {isDragActive
                    ? 'Drop your image here'
                    : 'Drag & drop an image or click to browse'}
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Supports JPG, PNG and GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={resetForm}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 mr-3"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Photo Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800 aspect-square flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Camera className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Adding descriptive titles and details helps you find your photos later.
                  </p>
                </div>
              </div>
              
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px]"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!file || !title}
                      icon={<Upload className="h-4 w-4 mr-2" />}
                    >
                      Upload Photo
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
        
      case 'uploading':
        return (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <Upload className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Uploading Photo</h2>
              <p className="text-gray-500 dark:text-gray-400">Please wait while we upload your photo...</p>
            </div>
            
            <div className="w-full max-w-md">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {uploadProgress}% complete
              </p>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Complete!</h2>
              <p className="text-gray-500 dark:text-gray-400">Your photo has been uploaded successfully.</p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Upload Another
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft className="h-4 w-4 mr-2" />}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Photos</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Add new photos to your collection
          </p>
        </div>
        
        <Card className="overflow-hidden">
          {renderUploadStep()}
        </Card>
      </div>
    </Layout>
  );
};