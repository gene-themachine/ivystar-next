'use client';

import { useState, useEffect } from 'react';
import Mentor from '@/components/mentor/mentor';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

interface MentorUser {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  role: 'mentor' | 'student';
  interests: string[];
  profilePhoto?: string;
  backgroundPhoto?: string;
  bio?: string;
  college?: string;
  gradeLevel?: string;
  isVerified?: boolean;
  projects?: {
    _id: string;
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
    isHighlighted?: boolean;
  }[];
}

export default function FindYourMentor() {
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('relevance');

  // Fetch mentors from the server
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        // Fetch all users with role "mentor"
        const response = await fetch('/api/users/mentors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch mentors');
        }
        
        const data = await response.json();
        setMentors(data.mentors || []);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMentors();
  }, []);

  // Filter mentors based on search term
  const filteredMentors = mentors.filter(mentor => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in username, college, bio, and interests
    return (
      mentor.username.toLowerCase().includes(searchLower) ||
      (mentor.college && mentor.college.toLowerCase().includes(searchLower)) ||
      (mentor.bio && mentor.bio.toLowerCase().includes(searchLower)) ||
      mentor.interests.some(interest => interest.toLowerCase().includes(searchLower))
    );
  });

  // Sort mentors based on selected option
  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortOption) {
      // Add more sort options when you have relevant fields (hourlyRate, ratings, etc.)
      default:
        return 0; // Default to original order
    }
  });

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-4">Find Your Mentor</h1>
        
        {/* Search & Filter Section */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by skills, topics, or mentor name..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                <FaFilter className="mr-2" />
                <span>Filters</span>
              </button>
              
              <select 
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="ratings">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-400">Loading mentors...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center my-8">
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && sortedMentors.length === 0 && (
          <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-2">No Mentors Found</h2>
            {searchTerm ? (
              <p className="text-gray-400">No mentors match your search criteria. Try a different search term.</p>
            ) : (
              <p className="text-gray-400">There are no mentors available at this time. Check back later!</p>
            )}
          </div>
        )}
        
        {/* Mentors Grid */}
        {!isLoading && !error && sortedMentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedMentors.map((mentor) => {
              // Find highlighted project if any
              const highlightedProject = mentor.projects?.find(project => project.isHighlighted);
              
              // Prepare portfolio data
              const portfolio = highlightedProject ? {
                src: highlightedProject.imageUrl,
                thumbnail: highlightedProject.imageUrl,
                title: highlightedProject.title,
                description: highlightedProject.description,
                width: 1200,
                height: 800
              } : undefined;
              
              return (
                <Mentor
                  key={mentor._id}
                  username={mentor.username}
                  school={mentor.college || 'University'}
                  hourlyRate={50} // Default for now
                  quote={mentor.bio || 'Ivystar Mentor'}
                  tags={mentor.interests}
                  profileImage={mentor.profilePhoto || '/images/default-profile.png'}
                  portfolio={portfolio}
                />
              );
            })}
          </div>
        )}
        
        {/* Load More Button - only show if we implement pagination */}
        {!isLoading && !error && sortedMentors.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
              Load More Mentors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



