import React, { useState, useMemo, useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { PhotoGrid } from "../components/photos/PhotoGrid";
import { usePhotos } from "../context/PhotoContext";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import {
    UploadCloud,
    RefreshCw,
    Grid,
    List,
    Search,
    Filter,
    SlidersHorizontal,
    Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Pagination } from "../components/ui/Pagination";

export const DashboardPage: React.FC = () => {
    const { getActivePhotos, loading, fetchPhotos } = usePhotos();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const photosPerPage = 12; // Show 12 photos per page
    
    // Fetch photos when component mounts
    useEffect(() => {
        fetchPhotos();
    }, []);
    
    const photos = getActivePhotos();

    // Filter photos based on search query
    const filteredPhotos = useMemo(() => {
        return searchQuery
            ? photos.filter(
                  (photo) =>
                      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (photo.description && photo.description.toLowerCase().includes(searchQuery.toLowerCase())),
              )
            : photos;
    }, [photos, searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

    // Get current page photos
    const currentPhotos = useMemo(() => {
        const indexOfLastPhoto = currentPage * photosPerPage;
        const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
        return filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);
    }, [filteredPhotos, currentPage, photosPerPage]);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top of photos section
        document.getElementById("photos-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Layout>
            {/* Hero section with welcome message */}
            <div className="relative mb-8 bg-gradient-to-r from-primary-600/90 to-accent-600/90 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full"></div>
                </div>

                <div className="relative px-6 py-8 md:px-10 md:py-12 text-white z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
                            <p className="mt-2 text-white/80">
                                You have {photos.length} {photos.length === 1 ? "photo" : "photos"} in your collection
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link to="/upload">
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    className="shadow-lg shadow-primary-700/20"
                                    icon={<UploadCloud className="h-5 w-5 mr-2" />}
                                >
                                    Upload New Photos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and filter bar */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search photos by title or description..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded transition-all ${
                                    viewMode === "grid"
                                        ? "bg-white dark:bg-gray-600 shadow text-primary-600 dark:text-primary-400"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                                aria-label="Grid view"
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded transition-all ${
                                    viewMode === "list"
                                        ? "bg-white dark:bg-gray-600 shadow text-primary-600 dark:text-primary-400"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                                aria-label="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            aria-label="Filter options"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        title: "Total Photos",
                        value: photos.length,
                        icon: <ImageIcon className="h-5 w-5 text-primary-500" />,
                        color: "bg-primary-50 dark:bg-primary-900/20",
                    },
                    {
                        title: "Shared Photos",
                        value: "N/A",
                        icon: <Filter className="h-5 w-5 text-accent-500" />,
                        color: "bg-accent-50 dark:bg-accent-900/20",
                    },
                    {
                        title: "Storage Used",
                        value: "N/A",
                        icon: <SlidersHorizontal className="h-5 w-5 text-purple-500" />,
                        color: "bg-purple-50 dark:bg-purple-900/20",
                    },
                    {
                        title: "Recent Uploads",
                        value: "N/A",
                        icon: <UploadCloud className="h-5 w-5 text-green-500" />,
                        color: "bg-green-50 dark:bg-green-900/20",
                    },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Photos section */}
            <div
                id="photos-section"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {searchQuery ? "Search Results" : "Your Photos"}
                    </h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {searchQuery ? (
                            <>
                                Found {filteredPhotos.length} {filteredPhotos.length === 1 ? "result" : "results"}
                            </>
                        ) : (
                            filteredPhotos.length > 0 && (
                                <>
                                    Showing {Math.min((currentPage - 1) * photosPerPage + 1, filteredPhotos.length)}-
                                    {Math.min(currentPage * photosPerPage, filteredPhotos.length)} of{" "}
                                    {filteredPhotos.length}
                                </>
                            )
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-16">
                        <RefreshCw className="h-10 w-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Loading your photos...</p>
                    </div>
                ) : (
                    <>
                        <PhotoGrid photos={currentPhotos} loading={loading} viewMode={viewMode} />

                        {/* Pagination */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                alwaysShow={true}
                            />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};