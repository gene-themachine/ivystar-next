'use client';

import { useState, useEffect } from 'react';
import Post from '@/components/Post';
import { PostType } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts', {
          // Include credentials to ensure cookies are sent for auth
          credentials: 'include',
          // Cache setting for fresh data
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        console.log('Raw posts data from API:', data.posts);
        
        // Transform the MongoDB data to match the PostType format
        const formattedPosts: PostType[] = data.posts.map((post: any) => {
          // More detailed logging for debugging
          console.log(`Post ${post._id} full data:`, post);
          console.log(`Like status for post ${post._id}:`, post.isLiked);
          console.log(`Author data for post ${post._id}:`, post.author);
          console.log(`Profile image for post ${post._id}:`, post.author.profileImage);
          
          // Improved profile image handling - carefully validate the URL
          let profileImage = null;
          if (post.author.profileImage) {
            const imageUrl = post.author.profileImage.trim();
            if (imageUrl && 
                (imageUrl.startsWith('http://') || 
                 imageUrl.startsWith('https://') || 
                 imageUrl.startsWith('/'))) {
              profileImage = imageUrl;
              console.log(`Validated profile image for post ${post._id}:`, profileImage);
            } else {
              console.warn(`Invalid profile image URL for post ${post._id}:`, imageUrl);
            }
          }
            
          return {
            id: post._id,
            author: post.author.username || 'Anonymous',
            isVerified: post.author.isVerified || false,
            profileImage,  // Use the validated image URL
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
            // Use the isLiked property from the API response
            isLiked: post.isLiked === true,
            role: post.author.role || 'student',
            // Use the isSaved property from the API response
            isSaved: post.isSaved === true,
            fieldOfStudy: (post.author.field && post.author.field !== 'N/A') 
                         ? post.author.field 
                         : undefined,
            images: post.images || [], // Include the post images
          };
        });
        
        setPosts(formattedPosts);
        console.log('Posts loaded successfully with like status');
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        toast.error('Could not load posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-400">Loading posts...</p>
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
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-gray-300 mb-2">No Posts Yet</h2>
            <p className="text-gray-400 mb-6">Be the first to share something with the community!</p>
            <button 
              onClick={() => router.push('/new-post')} 
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <Post key={post.id} {...post} onPostClick={handlePostClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 