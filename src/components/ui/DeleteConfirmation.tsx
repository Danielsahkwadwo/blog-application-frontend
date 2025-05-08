import React from 'react';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.'
}) => {
  // Log when component renders
  console.log("DeleteConfirmation rendered, isOpen:", isOpen);
  
  // Component is conditionally rendered by parent now
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          console.log("Overlay clicked");
          e.stopPropagation();
          onClose();
        }}
      />
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-slideUp relative z-[10000]"
        onClick={e => {
          console.log("Dialog content clicked");
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};