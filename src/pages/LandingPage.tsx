import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Camera, Image, Share2, Shield, ArrowRight, Sun, Moon } from "lucide-react";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <header className="bg-white/95 dark:bg-gray-800/95 shadow-md sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center group">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                                    <Camera className="h-8 w-8 text-primary-600 dark:text-primary-500 relative" />
                                </div>
                                <span className="ml-2 text-xl font-bold text-dark-900 dark:text-white">Photopia</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
                                aria-label="Toggle dark mode"
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {isAuthenticated ? (
                                <Link to="/dashboard">
                                    <Button>Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="hidden sm:block">
                                        <Button variant="outline">Log in</Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button>Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero section */}
                <section className="relative py-16 sm:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900"></div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-10 opacity-20 dark:opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-300 dark:bg-accent-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-block">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
                                        <span className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></span>
                                        New Features Available
                                    </span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 dark:text-white leading-tight">
                                    Your memories,{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                                        beautifully preserved
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                                    Store, organize, and share your photos with our secure and easy-to-use cloud
                                    platform. Access your memories anytime, anywhere.
                                </p>
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                    <Link to="/signup" className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            variant="gradient"
                                            className="text-lg w-full sm:w-auto group shadow-lg shadow-primary-500/20 dark:shadow-primary-700/20"
                                            icon={
                                                <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                            }
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link to="/login" className="w-full sm:w-auto">
                                        <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto">
                                            Log in
                                        </Button>
                                    </Link>
                                </div>

                                <div className="pt-4 flex items-center">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-primary-${i * 100} dark:bg-primary-${900 - i * 100}`}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-dark-900 dark:text-white">1,000+</span> happy
                                        users
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur opacity-30 dark:opacity-40 animate-pulse"></div>
                                <div className="relative rounded-lg overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105">
                                    <img
                                        src="https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg"
                                        alt="Photo gallery preview"
                                        className="w-full h-auto"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 rounded-lg overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-300 hover:scale-105 hover:z-10">
                                    <img
                                        src="https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg"
                                        alt="Photo gallery preview"
                                        className="w-72 h-auto"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden z-0">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 dark:bg-primary-900/20 rounded-full"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 dark:bg-accent-900/20 rounded-full"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <div className="text-center mb-16">
                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 rounded-full mb-3">
                                FEATURES
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white">
                                Everything you need for your photos
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-500 mx-auto my-4"></div>
                            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Organize, share, and protect your memories with our comprehensive photo management
                                system
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                <div className="rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-800 p-4 w-16 h-16 flex items-center justify-center mb-6 shadow-lg shadow-primary-100 dark:shadow-none">
                                    <Image className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">
                                    Unlimited Storage
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Store as many photos as you want with our unlimited cloud storage solution. Never
                                    worry about running out of space again.
                                </p>
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-primary-600 dark:text-primary-400 font-medium flex items-center">
                                        Learn more
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                </div>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                <div className="rounded-full bg-gradient-to-br from-accent-500 to-accent-600 dark:from-accent-600 dark:to-accent-800 p-4 w-16 h-16 flex items-center justify-center mb-6 shadow-lg shadow-accent-100 dark:shadow-none">
                                    <Share2 className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">Easy Sharing</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Share your photos with friends and family through time-limited links. Control who
                                    sees your memories and for how long.
                                </p>
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-accent-600 dark:text-accent-400 font-medium flex items-center">
                                        Learn more
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                </div>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
                                <div className="rounded-full bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-800 p-4 w-16 h-16 flex items-center justify-center mb-6 shadow-lg shadow-purple-100 dark:shadow-none">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">
                                    Secure Protection
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Your photos are encrypted and protected. Accidentally deleted photos go to the
                                    recycle bin for easy recovery.
                                </p>
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-purple-600 dark:text-purple-400 font-medium flex items-center">
                                        Learn more
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="py-24 bg-gradient-to-br from-dark-800 to-dark-900 text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                        <svg
                            className="absolute left-0 top-0 h-full"
                            viewBox="0 0 150 800"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M-40.4,645.5c29-39.5,120.8-31.9,151.2-70.3s-94-59.5-77.4-96.3S159.5,384.2,113,348.6s-102-142.6-53.9-187.1S252.6,28.7,193.5,3.7"
                                stroke="url(#gradient)"
                                strokeWidth="100"
                                fill="none"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#14b8a6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <svg
                            className="absolute right-0 bottom-0 h-full transform rotate-180"
                            viewBox="0 0 150 800"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M-40.4,645.5c29-39.5,120.8-31.9,151.2-70.3s-94-59.5-77.4-96.3S159.5,384.2,113,348.6s-102-142.6-53.9-187.1S252.6,28.7,193.5,3.7"
                                stroke="url(#gradient2)"
                                strokeWidth="100"
                                fill="none"
                            />
                            <defs>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#14b8a6" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
                        <div className="inline-flex items-center justify-center p-1 mb-8 bg-white/10 backdrop-blur-sm rounded-full">
                            <span className="px-4 py-1 text-sm font-medium bg-gradient-to-r from-primary-600 to-accent-500 rounded-full">
                                Limited Time Offer
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
                            Start preserving your memories today
                        </h2>

                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join thousands of users who trust Photopia with their precious memories. Get started with a
                            free account.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/signup" className="w-full sm:w-auto">
                                <Button size="lg" variant="gradient" className="text-lg w-full sm:w-auto">
                                    Create your free account
                                </Button>
                            </Link>

                            <div className="flex items-center text-sm">
                                <Shield className="h-5 w-5 mr-2 text-primary-400" />
                                <span>No credit card required</span>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                            {[
                                { number: "10M+", label: "Photos stored" },
                                { number: "50K+", label: "Happy users" },
                                { number: "99.9%", label: "Uptime" },
                                { number: "24/7", label: "Support" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full blur opacity-25"></div>
                                    <Camera className="h-8 w-8 text-primary-600 dark:text-primary-500 relative" />
                                </div>
                                <span className="ml-2 text-xl font-bold text-dark-900 dark:text-white">Photopia</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                                Photopia helps you store, organize, and share your photos securely. Our platform ensures
                                your memories are preserved for generations to come.
                            </p>
                            <div className="flex space-x-4">
                                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                        aria-label={`${social} link`}
                                    >
                                        <span className="sr-only">{social}</span>
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10z" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Product
                            </h3>
                            <ul className="space-y-3">
                                {["Features", "Pricing", "Security", "Beta Program"].map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Company
                            </h3>
                            <ul className="space-y-3">
                                {["About", "Blog", "Careers", "Contact", "Partners"].map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Photopia. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a
                                href="#"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
