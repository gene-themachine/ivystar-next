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
  showMessageButton?: boolean;
  onMessageClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  isVerified,
  school,
  hourlyRate,
  timeOnPlatform,
  profileImage,
  showMessageButton = true,
  onMessageClick
}) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32 sm:h-36"></div>
      <div className="px-4 sm:px-6 pb-6 -mt-14 relative">
        {/* Profile Image */}
        <div className="relative inline-block">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl">
            <Image 
              src={profileImage} 
              alt={username} 
              width={112} 
              height={112} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              {isVerified && (
                <FaCheckCircle className="text-blue-500 ml-2 text-lg" />
              )}
            </div>
            <div className="flex items-center text-gray-400 mt-1">
              <FaUniversity className="mr-2" />
              <span>{school}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                <FaDollarSign className="text-green-400 mr-1" />
                <span className="text-green-400 font-medium">${hourlyRate.toFixed(2)}/hr</span>
              </div>
              <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                <FaClock className="text-blue-400 mr-1" />
                <span className="text-blue-400 font-medium">{timeOnPlatform}</span>
              </div>
            </div>
          </div>
          
          {showMessageButton && (
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={onMessageClick}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-orange-600 transition text-sm"
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