'use client'

import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface MentorProps {
  username: string;
  school: string;
  hourlyRate: number;
  quote: string;
  tags: string[];
  profileImage?: string;
}

export default function Mentor({ 
  username, 
  school, 
  hourlyRate, 
  quote, 
  tags, 
  profileImage
}: MentorProps) {
  return (
    <Link href={`/mentors/${username}`} className="block group h-full">
      <div className={`${inter.className} bg-gray-900 text-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-800 transition-all cursor-pointer h-full flex flex-col`}>
        <div className="p-5 flex-grow flex flex-col">
          {/* Header with profile pic and info - consistent height */}
          <div className="flex items-start gap-4 h-20">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 shrink-0 relative ring-1 ring-gray-700">
              {profileImage ? (
                <Image 
                  src={`/images/${profileImage}`} 
                  alt={username} 
                  fill
                  className="object-cover"
                  sizes="64px"
                  priority
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
              <h3 className="font-bold text-lg text-white tracking-tight">{username}</h3>
              <div className="text-gray-400 text-sm -mt-1">
                {school}
              </div>
              <div className="text-gray-300 text-sm -mt-1">
                <span className="font-normal">${hourlyRate}</span>/hour
              </div>
            </div>
          </div>
          
          {/* Quote section with fixed height */}
          <div className="my-4 bg-gray-800/40 backdrop-blur-sm p-4 rounded-md border border-gray-700/50 h-32 overflow-y-auto relative">
            <div className="absolute top-2 left-2 opacity-30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 7H4.5C3.675 7 3 7.675 3 8.5V12.5C3 14.433 4.567 16 6.5 16H7.5C8.325 16 9 15.325 9 14.5V8.5C9 7.675 8.325 7 7.5 7Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M19.5 7H16.5C15.675 7 15 7.675 15 8.5V14.5C15 15.325 15.675 16 16.5 16H17.5C19.433 16 21 14.433 21 12.5V8.5C21 7.675 20.325 7 19.5 7Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-100 leading-relaxed pl-5">
              {quote}
            </p>
          </div>
          
          {/* Tags section without fixed height */}
          <div className="flex flex-wrap gap-x-2 gap-y-2 pt-3 mt-auto border-t border-gray-800">
            {tags.slice(0, Math.ceil(tags.length/2)).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-300 border border-gray-700 group-hover:border-gray-600 hover:bg-gray-700 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
