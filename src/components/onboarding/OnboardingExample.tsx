'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { OnboardingModal } from './index';

// Define type for user metadata to avoid 'unknown' type errors
interface UserMetadata {
  role?: string;
  username?: string;
  interests?: string[];
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
    return <div>Loading...</div>;
  }

  // Cast metadata to our custom type to avoid TypeScript errors
  const metadata = user?.unsafeMetadata as UserMetadata | undefined;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Onboarding Example</h1>
      
      {isSignedIn ? (
        <div>
          <p className="mb-4">
            Welcome, {metadata?.username || user?.firstName || 'User'}!
          </p>
          
          <button
            onClick={handleShowModal}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Open Onboarding Modal
          </button>
          
          {/* Display user information if available */}
          {metadata?.role && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
              <p><strong>Role:</strong> {metadata.role}</p>
              <p><strong>Username:</strong> {metadata.username}</p>
              {Array.isArray(metadata.interests) && metadata.interests.length > 0 && (
                <div>
                  <p><strong>Interests:</strong></p>
                  <ul className="list-disc pl-5">
                    {metadata.interests.map((interest: string) => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Please sign in to see the onboarding flow.</p>
      )}

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  );
} 