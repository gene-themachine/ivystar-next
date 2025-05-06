'use client';

import Image from 'next/image';
import { FaCheckCircle, FaUniversity, FaDollarSign, FaClock, FaPlus, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

interface ProfileHeaderProps {
  username: string;
  isVerified: boolean;
  school: string;
  hourlyRate: number;
  timeOnPlatform: string;
  profileImage: string;
  backgroundImage?: string | null;
  showMessageButton?: boolean;
  onMessageClick?: () => void;
  role?: 'mentor' | 'student';
  gradeLevel?: string;
  interests?: string[];
  isEditing?: boolean;
  onInterestsChange?: (interests: string[]) => void;
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
  onMessageClick,
  role = 'student',
  gradeLevel,
  interests = [],
  isEditing = false,
  onInterestsChange
}) => {
  console.log("Personal profile role received:", role); // Debug role
  
  // State for new interest being added
  const [newInterest, setNewInterest] = useState('');

  // Handle adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      onInterestsChange?.(updatedInterests);
      setNewInterest('');
    }
  };

  // Handle removing an interest
  const handleRemoveInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    onInterestsChange?.(updatedInterests);
  };

  // Handle key press (Enter to add interest)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
      {/* Banner image */}
      <div className="relative h-64 overflow-hidden">
        {backgroundImage ? (
          <Image 
            src={backgroundImage}
            alt="Profile background"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'center',
              width: '100%',
              height: '100%'
            }}
            className="transition-opacity duration-500"
            onError={(e) => {
              // If image fails to load, fallback to a default background
              console.warn('Failed to load background image:', backgroundImage);
              // @ts-ignore - typecasting the event target
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = '/images/bg.png';
            }}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
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
          <div className="w-full">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              {isVerified && (
                <FaCheckCircle className="text-blue-500 ml-2 text-lg" />
              )}
            </div>
            
            {/* Role and Interests in a single row */}
            <div className="flex flex-wrap items-center gap-2 text-gray-400 mt-1">
              {/* Role badge */}
              <div className={`px-3 py-1 rounded-md text-sm font-medium border ${
                role === 'mentor'
                ? 'border-orange-500 text-orange-400 bg-orange-950/30' 
                : 'border-blue-500 text-blue-400 bg-blue-950/30'
              }`}>
                {role === 'mentor' ? 'Mentor' : 'Student'}
              </div>
              
              {/* Interests label */}
              <span className="text-sm text-gray-400 ml-1">Interests:</span>
              
              {/* Interests tags */}
              {interests.map((interest, index) => (
                <div 
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center 
                    ${role === 'mentor' 
                      ? 'bg-orange-900/30 text-orange-400 border border-orange-700/30' 
                      : 'bg-blue-900/30 text-blue-400 border border-blue-700/30'}`}
                >
                  <span>{interest}</span>
                  {isEditing && (
                    <button 
                      className="ml-1.5 hover:text-white"
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>
              ))}
              
              {/* Add interest input - show only in edit mode */}
              {isEditing && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add interest..."
                    className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-300 w-24 sm:w-28"
                  />
                  <button
                    onClick={handleAddInterest}
                    className={`px-1 py-1 rounded-md text-xs ${
                      role === 'mentor' ? 'bg-orange-800 text-white' : 'bg-blue-800 text-white'
                    }`}
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              {role === 'mentor' && school && (
                <div className="flex items-center text-sm text-gray-400">
                  <FaUniversity className="mr-2" />
                  <span>{school}</span>
                </div>
              )}
              {gradeLevel && (
                <div className="flex items-center text-sm text-gray-400">
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">
                    {gradeLevel}
                  </span>
                </div>
              )}
            </div>
            
            {/* Message button */}
            {showMessageButton && (
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={onMessageClick}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition text-sm"
                >
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 