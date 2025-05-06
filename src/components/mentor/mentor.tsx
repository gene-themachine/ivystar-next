'use client'

import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface PortfolioItem {
  src: string;
  thumbnail: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

interface MentorProps {
  username: string;
  school: string;
  hourlyRate: number;
  tags: string[];
  bio?: string;
  profileImage?: string;
  portfolio?: PortfolioItem;
}

export default function Mentor({ 
  username, 
  school, 
  hourlyRate, 
  tags, 
  bio,
  profileImage,
  portfolio
}: MentorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [portfolioImageError, setPortfolioImageError] = useState(false);
  
  // Function to handle profile image errors
  const handleProfileImageError = () => {
    setProfileImageError(true);
  };
  
  // Function to handle portfolio image errors
  const handlePortfolioImageError = () => {
    setPortfolioImageError(true);
  };
  
  return (
    <Link 
      href={`/mentors/${username}`} 
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className={`${inter.className} bg-gray-900 text-white rounded-xl overflow-hidden shadow-sm border border-gray-800 transition-all duration-300 h-full flex flex-col`}
        whileHover={{ 
          scale: 1.02,
          borderColor: 'rgba(59, 130, 246, 0.5)' // Blue border on hover
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="p-5 flex-grow flex flex-col">
          {/* Header with profile pic and info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 shrink-0 relative ring-2 ring-gray-700 transition-all duration-300">
              {profileImage && !profileImageError ? (
                <Image 
                  src={profileImage} 
                  alt={username} 
                  fill
                  className="object-cover"
                  sizes="64px"
                  priority
                  onError={handleProfileImageError}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">
                {username}
              </h3>
              <div className="text-gray-400 text-sm">
                {school}
              </div>
              <div className="flex items-center bg-blue-900/30 px-2 py-0.5 rounded-md text-sm w-fit mt-1">
                <span className="text-blue-400 font-medium">${hourlyRate}</span>
                <span className="text-gray-400 ml-1">/hour</span>
              </div>
            </div>
          </div>
          
          {/* Bio section */}
          {bio && (
            <div className="my-4 relative">
              <svg className="text-blue-500/30 absolute left-0 top-0 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3 5.2c-3.7.8-6.5 5-6.5 9.3 0 2.4 1 4.7 2.5 6.2l1.3-1.5c-1.1-1.1-1.7-2.7-1.7-4.6.8 0 1.5-.2 2.2-.5 1.4-.8 2.2-2.1 2.2-3.5 0-1.2-.5-2.4-1.3-3.2-.8-.7-1.8-1.3-2.7-1.5l-1-.7zm8 0c-3.7.8-6.5 5-6.5 9.3 0 2.4 1 4.7 2.5 6.2l1.3-1.5c-1.1-1.1-1.7-2.7-1.7-4.6.8 0 1.5-.2 2.2-.5 1.4-.8 2.2-2.1 2.2-3.5 0-1.2-.5-2.4-1.3-3.2-.8-.7-1.8-1.3-2.7-1.5l-1-.7z"/>
              </svg>
              <p className="text-sm font-medium text-gray-300 leading-relaxed pl-7 italic line-clamp-3">
                {bio}
              </p>
            </div>
          )}
          
          {/* Portfolio preview if available */}
          {portfolio && (
            <div className="mt-3 mb-4">
              <div className="relative w-full h-32 bg-gray-800 rounded-md overflow-hidden">
                {!portfolioImageError ? (
                  <Image
                    src={portfolio.thumbnail}
                    alt={portfolio.title}
                    fill
                    className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={handlePortfolioImageError}
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent flex flex-col justify-end p-3">
                  <h4 className="text-sm font-bold text-white">{portfolio.title}</h4>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">{portfolio.description}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Tags section */}
          <div className="flex flex-wrap gap-x-2 gap-y-2 pt-3 mt-auto border-t border-gray-800">
            {tags.slice(0, 4).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-300 border border-gray-700 group-hover:border-blue-800/50 hover:bg-gray-700 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-blue-400 border border-gray-700">
                +{tags.length - 4} more
              </span>
            )}
          </div>
          
          {/* View Profile Button */}
          <div className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md text-sm font-medium transition-colors">
              View Profile
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
