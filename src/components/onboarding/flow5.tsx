'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Flow5Props {
  errors: Record<string, string>;
  username: string;
  userRole: 'mentor' | 'student' | null;
  interests: string[];
  profilePhoto: string;
  college?: string;
  gradeLevel?: string;
}

const Flow5: React.FC<Flow5Props> = ({ 
  username,
  userRole,
  interests,
  profilePhoto,
  college,
  gradeLevel,
  errors
}) => {
  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-semibold mb-3 text-center">Preview Your Profile</h3>
      <p className="text-gray-400 mb-6 text-center text-base">
        Here's how your profile will appear to others
      </p>
      
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500">
            {profilePhoto && profilePhoto !== '/default-profile.jpg' ? (
              <Image 
                src={profilePhoto} 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-1">{username}</h3>
            <div className="flex flex-col gap-2">
              <span className="text-sm px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full inline-block w-fit">
                {userRole === 'mentor' ? 'Mentor' : 'Student'}
              </span>
              {userRole === 'mentor' && college && (
                <div className="flex items-center text-sm text-gray-300">
                  <span className="text-gray-500 mr-2">•</span>
                  {college}
                </div>
              )}
              {gradeLevel && (
                <div className="flex items-center text-sm text-gray-300">
                  <span className="text-gray-500 mr-2">•</span>
                  {gradeLevel}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {interests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Interests:</h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {interests.map((interest) => (
                <div 
                  key={interest}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm font-medium"
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Flow5;
