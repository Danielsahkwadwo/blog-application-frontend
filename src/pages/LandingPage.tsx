import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Camera, Image, Share2, Shield, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Camera className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-dark-900">Photopia</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
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
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 leading-tight">
                  Your memories, beautifully preserved
                </h1>
                <p className="text-lg text-gray-600">
                  Store, organize, and share your photos with our secure and easy-to-use cloud platform. Access your memories anytime, anywhere.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/signup">
                    <Button 
                      size="lg" 
                      className="text-lg"
                      icon={<ArrowRight className="h-5 w-5 ml-1" />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="rounded-lg overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg"
                    alt="Photo gallery preview"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-lg overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg"
                    alt="Photo gallery preview"
                    className="w-72 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-dark-900">
                Everything you need for your photos
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Organize, share, and protect your memories with our comprehensive photo management system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Image className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-2">
                  Unlimited Storage
                </h3>
                <p className="text-gray-600">
                  Store as many photos as you want with our unlimited cloud storage solution. Never worry about running out of space again.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="rounded-full bg-accent-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-2">
                  Easy Sharing
                </h3>
                <p className="text-gray-600">
                  Share your photos with friends and family through time-limited links. Control who sees your memories and for how long.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-2">
                  Secure Protection
                </h3>
                <p className="text-gray-600">
                  Your photos are encrypted and protected. Accidentally deleted photos go to the recycle bin for easy recovery.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-dark-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Start preserving your memories today
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of users who trust Photopia with their precious memories
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="text-lg"
              >
                Create your free account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Camera className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-dark-900">Photopia</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Photopia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};