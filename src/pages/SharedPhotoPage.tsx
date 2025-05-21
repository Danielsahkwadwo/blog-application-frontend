import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Camera, Download, AlertTriangle, ArrowLeft } from "lucide-react";

// In a real app, this would fetch from the backend
// For this demo, we'll use a static photo
export interface Photo {
    photoId: string;
    imageUrl: string;
    title: string;
    description?: string;
    uploadedAt: string;
    isDeleted: boolean;
    userId: string;
}

export const SharedPhotoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedPhoto = async () => {
            setLoading(true);

            const response = await fetch(
                `https://v57gg0e6n4.execute-api.eu-central-1.amazonaws.com/prod/shared/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                setError("Failed to fetch photo");
                setLoading(false);
                return;
            }

            const data = await response.json();
            setPhoto(data);

            setLoading(false);
        };

        fetchSharedPhoto();
    }, [id]);

    const handleDownload = () => {
        if (!photo) return;

        const link = document.createElement("a");
        link.href = photo.imageUrl;
        link.download = `${photo.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !photo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <div className="mx-auto rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{"Invalid Link"}</h2>
                        <p className="mt-2 text-gray-600">
                            {"The shared link you accessed is invalid or has been removed."}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/" className="w-full">
                            <Button fullWidth>Go to Homepage</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <Camera className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-dark-900">Photopia</span>
                        </Link>
                    </div>
                    <Link to="/">
                        <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
                            Go to App
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">{photo.title}</h1>
                    </div>

                    <div className="flex justify-center bg-gray-50 p-6">
                        <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="max-w-full max-h-[70vh] object-contain rounded"
                        />
                    </div>

                    {photo.description && (
                        <div className="p-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Description</h2>
                            <p className="mt-2 text-gray-600">{photo.description}</p>
                        </div>
                    )}

                    <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
                        <Button onClick={handleDownload} icon={<Download className="h-4 w-4" />}>
                            Download
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};
