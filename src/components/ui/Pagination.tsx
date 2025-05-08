import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  alwaysShow?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  alwaysShow = false,
}) => {
  // Don't render pagination if there's only one page and alwaysShow is false
  if (totalPages <= 1 && !alwaysShow) return null;

  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (validPage !== currentPage) {
      onPageChange(validPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= Math.max(1, totalPages); i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of page numbers to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // If there are no pages, show a disabled "1" button
  if (totalPages <= 0 && alwaysShow) {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 opacity-50 cursor-not-allowed"
          disabled={true}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 opacity-50 cursor-not-allowed"
          disabled={true}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="px-3 py-2 bg-primary-600 text-white"
          disabled={true}
        >
          1
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 opacity-50 cursor-not-allowed"
          disabled={true}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 opacity-50 cursor-not-allowed"
          disabled={true}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* First page button */}
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      {/* Previous page button */}
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              className={`px-3 py-2 ${
                currentPage === page 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      
      {/* Next page button */}
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* Last page button */}
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};