import React, { useState, useMemo } from "react";
import { Layout } from "../components/layout/Layout";
import { PhotoGrid } from "../components/photos/PhotoGrid";
import { usePhotos } from "../context/PhotoContext";
import { Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { DeleteConfirmation } from "../components/ui/DeleteConfirmation";
import { Pagination } from "../components/ui/Pagination";

export const RecycleBinPage: React.FC = () => {
    const { getDeletedPhotos, loading } = usePhotos();
    const [currentPage, setCurrentPage] = useState(1);
    const photosPerPage = 12; // Show 12 photos per page
    const deletedPhotos = getDeletedPhotos();
    const [showEmptyConfirmation, setShowEmptyConfirmation] = useState(false);

    // Get current page photos
    const currentPhotos = useMemo(() => {
        const indexOfLastPhoto = currentPage * photosPerPage;
        const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
        return deletedPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);
    }, [deletedPhotos, currentPage, photosPerPage]);

    // Calculate pagination
    const totalPages = Math.ceil(deletedPhotos.length / photosPerPage);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top of photos section
        document.getElementById("photos-section")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleEmptyRecycleBin = () => {
        // In a real app, this would permanently delete all photos in the recycle bin
        setShowEmptyConfirmation(false);
        // Implementation would go here
    };

    return (
        <Layout>
            {/* Header section */}
            <div className="relative mb-8 bg-gradient-to-r from-gray-700/90 to-gray-800/90 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full"></div>
                </div>

                <div className="relative px-6 py-8 md:px-10 md:py-12 text-white z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center">
                            <div className="p-3 bg-white/10 rounded-lg mr-4">
                                <Trash2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Recycle Bin</h1>
                                <p className="mt-1 text-white/80">
                                    {deletedPhotos.length} {deletedPhotos.length === 1 ? "item" : "items"} in your
                                    recycle bin
                                </p>
                            </div>
                        </div>

                        {deletedPhotos.length > 0 && (
                            <div className="mt-4 md:mt-0">
                                <Button
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                    icon={<Trash2 className="h-4 w-4 mr-2" />}
                                    onClick={() => setShowEmptyConfirmation(true)}
                                >
                                    Empty Recycle Bin
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info alert */}
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start">
                <div className="p-1 bg-blue-100 dark:bg-blue-800/30 rounded-full mr-3 mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">About Recycle Bin</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Items in the recycle bin will be automatically deleted after 30 days. You can restore items or
                        empty the bin at any time.
                    </p>
                </div>
            </div>

            {/* Photos grid */}
            <div
                id="photos-section"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-16">
                        <RefreshCw className="h-10 w-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Loading deleted photos...</p>
                    </div>
                ) : (
                    <>
                        {deletedPhotos.length > 0 && (
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Deleted Photos</h2>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing {Math.min((currentPage - 1) * photosPerPage + 1, deletedPhotos.length)}-
                                    {Math.min(currentPage * photosPerPage, deletedPhotos.length)} of{" "}
                                    {deletedPhotos.length}
                                </div>
                            </div>
                        )}

                        <PhotoGrid photos={currentPhotos} isRecycleBin={true} />

                        {/* Pagination */}
                        {deletedPhotos.length > photosPerPage && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Empty recycle bin confirmation */}
            {showEmptyConfirmation && (
                <DeleteConfirmation
                    onClose={() => setShowEmptyConfirmation(false)}
                    onConfirm={handleEmptyRecycleBin}
                    title="Empty Recycle Bin"
                    message="Are you sure you want to permanently delete all items in the recycle bin? This action cannot be undone."
                />
            )}
        </Layout>
    );
};
