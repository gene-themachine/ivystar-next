'use client';

import { useState, useEffect } from 'react';
import Post from '@/components/Post';
import Mentor from '@/components/mentor/mentor';
import { PostType } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface MentorType {
  _id: string;
  clerkId: string;
  username: string;
  school: string;
  hourlyRate: number;
  tags: string[];
  profileImage: string;
  bio?: string;
  isVerified?: boolean;
  projects?: any[];
}

export default function Saved() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Posts');
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [savedMentors, setSavedMentors] = useState<MentorType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved posts when component mounts
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setIsLoadingPosts(true);
        
        // First get the current user's saved posts
        const response = await fetch('/api/user/saved-posts', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // User is not logged in, redirect to login
            router.push('/sign-in');
            return;
          }
          throw new Error('Failed to fetch saved posts');
        }
        
        const data = await response.json();
        console.log('Saved posts data from API:', data);
        
        // If no saved posts, set empty array
        if (!data.posts || !Array.isArray(data.posts) || data.posts.length === 0) {
          setSavedPosts([]);
          setIsLoadingPosts(false);
          return;
        }
        
        // Transform the MongoDB data to match the PostType format
        const formattedPosts: PostType[] = data.posts.map((post: any) => {
          // More detailed logging for debugging
          console.log(`Saved post ${post._id}:`, post);
          
          // Improved profile image handling - carefully validate the URL
          let profileImage = null;
          if (post.author.profileImage) {
            const imageUrl = post.author.profileImage.trim();
            if (imageUrl && 
                (imageUrl.startsWith('http://') || 
                 imageUrl.startsWith('https://') || 
                 imageUrl.startsWith('/'))) {
              profileImage = imageUrl;
            }
          }
            
          return {
            id: post._id,
            author: post.author.username || 'Anonymous',
            isVerified: post.author.isVerified || false,
            profileImage, 
            institution: (post.author.institution && 
                         post.author.institution !== 'Unknown Institution' && 
                         post.author.institution !== 'Default University') 
                         ? post.author.institution 
                         : undefined,
            timeAgo: formatTimeAgo(post.createdAt),
            community: post.community || 'General',
            title: post.title,
            content: post.content,
            tags: post.tags || [],
            likes: post.likes || 0,
            comments: post.comments || 0,
            isLiked: post.isLiked || false,
            isSaved: true, // These are saved posts so always set to true
            fieldOfStudy: (post.author.field && post.author.field !== 'N/A') 
                         ? post.author.field 
                         : undefined,
            images: post.images || [],
          };
        });
        
        setSavedPosts(formattedPosts);
        console.log('Saved posts loaded successfully');
      } catch (err) {
        console.error('Error fetching saved posts:', err);
        setError('Failed to load saved posts. Please try again later.');
        toast.error('Could not load saved posts. Please try again.');
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    fetchSavedPosts();
  }, [router]);

  // Fetch saved mentors when component mounts or tab changes to Mentors
  useEffect(() => {
    // Only fetch if the Mentors tab is active
    if (activeTab !== 'Mentors') return;
    
    const fetchSavedMentors = async () => {
      try {
        setIsLoadingMentors(true);
        
        const response = await fetch('/api/user/saved-mentors', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // User is not logged in, redirect to login
            router.push('/sign-in');
            return;
          }
          throw new Error('Failed to fetch saved mentors');
        }
        
        const data = await response.json();
        console.log('Saved mentors data from API:', data);
        
        if (!data.mentors || !Array.isArray(data.mentors)) {
          setSavedMentors([]);
        } else {
          setSavedMentors(data.mentors);
        }
      } catch (err) {
        console.error('Error fetching saved mentors:', err);
        setError('Failed to load saved mentors. Please try again later.');
        toast.error('Could not load saved mentors. Please try again.');
      } finally {
        setIsLoadingMentors(false);
      }
    };
    
    fetchSavedMentors();
  }, [activeTab, router]);

  const handlePostClick = (id: string) => {
    console.log(`Post ${id} clicked`);
    // Navigate to post detail page
    router.push(`/post/${id}`);
  };

  // Helper function to format time ago
  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Saved Items</h1>
          <p className="text-gray-400">Your collection of saved content</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Posts' 
              ? 'text-white border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Posts')}
          >
            Posts
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Mentors' 
              ? 'text-white border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Mentors')}
          >
            Mentors
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'Posts' && (
          <>
            {isLoadingPosts ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p className="mt-4 text-gray-400">Loading saved posts...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
                <p className="text-red-300">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            ) : savedPosts.length > 0 ? (
              <div className="space-y-6">
                {savedPosts.map(post => (
                  <Post key={post.id} {...post} onPostClick={handlePostClick} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 mb-4">You haven't saved any posts yet.</p>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
                  onClick={() => router.push('/')}
                >
                  Browse Posts
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'Mentors' && (
          <>
            {isLoadingMentors ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p className="mt-4 text-gray-400">Loading saved mentors...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
                <p className="text-red-300">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            ) : savedMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedMentors.map((mentor) => {
                  // Find the mentor's highlighted project if any
                  const highlightedProject = mentor.projects?.find(project => project.isHighlighted);
                  
                  // Prepare portfolio data if a highlighted project exists
                  const portfolio = highlightedProject ? {
                    src: highlightedProject.imageUrl,
                    thumbnail: highlightedProject.imageUrl,
                    title: highlightedProject.title,
                    description: highlightedProject.description || highlightedProject.summary,
                    width: 1200,
                    height: 800
                  } : undefined;
                  
                  return (
                    <Mentor
                      key={mentor._id}
                      username={mentor.username}
                      school={mentor.school}
                      hourlyRate={mentor.hourlyRate}
                      tags={mentor.tags}
                      profileImage={mentor.profileImage}
                      portfolio={portfolio}
                      bio={mentor.bio}
                      isVerified={mentor.isVerified}
                      clerkId={mentor.clerkId}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 mb-4">You haven't saved any mentors yet.</p>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
                  onClick={() => router.push('/find-your-mentor')}
                >
                  Find Mentors
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
