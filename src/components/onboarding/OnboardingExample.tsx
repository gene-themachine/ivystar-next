'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { OnboardingModal } from './index';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define type for user metadata to avoid 'unknown' type errors
interface UserMetadata {
  role?: string;
  username?: string;
  interests?: string[];
  profilePhoto?: string;
  projectPhoto?: string;
  projectDescription?: string;
}

/**
 * Example component showing how to implement the onboarding flow
 * This would typically be used in your layout or main page component
 */
export default function OnboardingExample() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only run this check when the user data is loaded
    if (isLoaded && isSignedIn && user) {
      // Cast to our custom type to avoid TypeScript errors
      const metadata = user.unsafeMetadata as UserMetadata;
      
      // Check if the user has completed onboarding by looking at their metadata
      const hasCompletedOnboarding = metadata?.role && 
                                    metadata?.username && 
                                    Array.isArray(metadata?.interests) &&
                                    metadata?.interests.length > 0;
      
      // Show the modal if onboarding is not complete
      if (!hasCompletedOnboarding) {
        setShowModal(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Function to handle closing the modal (only if onboarding is complete)
  const handleCloseModal = () => {
    // In a real app, you might want to check if onboarding is complete
    // before allowing the user to close the modal
    setShowModal(false);
  };

  // For demonstration purposes, add a button to show the modal again
  const handleShowModal = () => {
    setShowModal(true);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Cast metadata to our custom type to avoid TypeScript errors
  const metadata = user?.unsafeMetadata as UserMetadata | undefined;

  return (
    <div className="bg-gray-950 min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Onboarding Example
        </motion.h1>
        
        {isSignedIn ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gray-800 rounded-full overflow-hidden border-2 border-orange-500 flex items-center justify-center">
                {metadata?.profilePhoto ? (
                  <Image 
                    src={metadata.profilePhoto} 
                    alt="Profile" 
                    width={56} 
                    height={56} 
                    className="object-cover" 
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {(metadata?.username || user?.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <motion.p className="text-lg font-semibold text-white">
                  Welcome, {metadata?.username || user?.firstName || 'User'}!
                </motion.p>
                <p className="text-sm text-gray-400">
                  {metadata?.role || 'Complete your profile to get started'}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={handleShowModal}
              className="px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Open Onboarding Modal
            </motion.button>
            
            {/* Display user information if available */}
            {metadata?.role && (
              <motion.div 
                className="mt-8 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Your Profile
                  </h2>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <p className="font-semibold text-white mb-2">Basic Info</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Role</p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                            metadata.role === 'mentor' 
                              ? 'bg-orange-500 bg-opacity-20 text-orange-400' 
                              : 'bg-blue-500 bg-opacity-20 text-blue-400'
                          }`}>
                            {metadata.role}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Username</p>
                          <p className="text-white">{metadata.username}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                      <p className="font-semibold text-white mb-2">Interests</p>
                      {Array.isArray(metadata.interests) && metadata.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {metadata.interests.map((interest: string) => (
                            <span 
                              key={interest} 
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Information (if available) */}
                  {metadata?.projectDescription && (
                    <div className="pt-5 border-t border-gray-700">
                      <p className="font-semibold text-white mb-3">Featured Project</p>
                      
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        {metadata.projectPhoto && (
                          <div className="h-48 w-full relative">
                            <Image 
                              src={metadata.projectPhoto} 
                              alt="Project" 
                              fill
                              className="object-cover" 
                            />
                          </div>
                        )}
                        
                        <div className="p-4">
                          <p className="text-gray-300">{metadata.projectDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="p-6 bg-gray-800 rounded-xl border border-gray-700 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="font-medium text-white">Authentication Required</p>
            </div>
            <p>Please sign in to see the onboarding flow and complete your profile setup.</p>
          </motion.div>
        )}

        {/* Onboarding Modal */}
        <OnboardingModal isOpen={showModal} onClose={handleCloseModal} />
      </div>
    </div>
  );
} 