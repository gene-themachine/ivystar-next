'use client';

import Image from 'next/image';
import { FaCheckCircle, FaUniversity, FaDollarSign, FaClock } from 'react-icons/fa';

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
  isEditing?: boolean;
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
  isEditing = false
}) => {
  console.log("Personal profile role received:", role); // Debug role

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
            sizes="100vw"
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
              {role === 'mentor' && (
                <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5 text-sm">
                  <FaDollarSign className="text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">${hourlyRate.toFixed(2)}/hr</span>
                </div>
              )}
              <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5 text-sm">
                <FaClock className="text-blue-400 mr-1" />
                <span className="text-blue-400 font-medium">{timeOnPlatform}</span>
              </div>
            </div>
          </div>
          
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
  );
};

export default ProfileHeader; 