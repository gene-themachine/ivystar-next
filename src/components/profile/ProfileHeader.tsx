'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaUniversity, FaDollarSign, FaBookmark } from 'react-icons/fa';
import MessageButton from '@/components/MessageButton';

interface ProfileHeaderProps {
  username: string;
  isVerified: boolean;
  school: string;
  hourlyRate: number;
  timeOnPlatform: string;
  profileImage: string;
  backgroundImage: string | null;
  showMessageButton?: boolean;
  recipientId?: string;
  role?: 'mentor' | 'student';
  gradeLevel?: string;
  clerkId?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  isVerified,
  school,
  hourlyRate,
  timeOnPlatform,
  profileImage,
  backgroundImage,
  showMessageButton = true,
  recipientId,
  role = 'mentor',
  gradeLevel,
  clerkId
}) => {
  const [isImageError, setIsImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleImageError = () => {
    setIsImageError(true);
  };

  // Check if the mentor is saved
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!clerkId || role !== 'mentor') return;
      
      try {
        const response = await fetch(`/api/users/${clerkId}/save`);
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.saved);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkSavedStatus();
  }, [clerkId, role]);

  // Toggle save status
  const handleSave = async () => {
    if (!clerkId || role !== 'mentor' || isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${clerkId}/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
      {/* Banner image */}
      <div className="relative h-64 overflow-hidden">
        {backgroundImage && !isImageError ? (
          <Image 
            src={backgroundImage}
            alt={`${username}'s background`}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 bg-black"></div>
        )}
        
        {/* Profile Image - positioned within the banner */}
        <div className="absolute bottom-4 left-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl">
            {profileImage ? (
              <Image 
                src={profileImage} 
                alt={username} 
                width={96} 
                height={96} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile content area */}
      <div className="px-4 py-4 relative">
        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              {isVerified && (
                <FaCheckCircle className="text-blue-500 ml-2 text-lg" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`px-3 py-1 rounded-md text-sm font-medium border ${
                role === 'mentor'
                ? 'border-orange-500 text-orange-400 bg-orange-950/30' 
                : 'border-blue-500 text-blue-400 bg-blue-950/30'
              }`}>
                {role === 'mentor' ? 'Mentor' : 'Student'}
              </div>
              
              {/* Display Grade Level if available */}
              {gradeLevel && (
                <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                  {gradeLevel}
                </div>
              )}
            </div>
            <div className="flex items-center text-gray-400 mt-2">
              <FaUniversity className="mr-2" />
              <span>{school}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5 text-sm">
                <FaDollarSign className="text-green-400 mr-1" />
                <span className="text-green-400 font-medium">${hourlyRate.toFixed(2)}/hr</span>
              </div>
              {timeOnPlatform && (
                <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-blue-400 font-medium">{timeOnPlatform}</span>
                </div>
              )}
            </div>
          </div>
          
          {showMessageButton && (
            <div className="mt-4 sm:mt-0 flex gap-2">
              {recipientId && (
                <MessageButton
                  recipientId={recipientId} 
                  recipientName={username}
                  className="bg-orange-500 hover:bg-orange-600"
                />
              )}
              
              {role === 'mentor' && clerkId && (
                <button 
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm
                    ${isSaved 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                  disabled={isLoading}
                >
                  <FaBookmark className={isSaved ? 'text-white' : 'text-gray-400'} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 