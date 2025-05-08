'use client'

import React, { useState, useEffect } from 'react';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaCheck, FaGraduationCap, FaChalkboardTeacher, FaImage } from 'react-icons/fa';
import { PostType } from '@/types';
import Image from 'next/image';
import ProfileImage from './ProfileImage';
import { toast } from 'react-hot-toast';

interface PostProps extends PostType {
  onPostClick?: (id: string) => void;
}

const Post: React.FC<PostProps> = ({
  id,
  author,
  isVerified,
  profileImage,
  institution,
  timeAgo,
  title,
  content,
  tags,
  likes,
  comments,
  isLiked,
  isSaved,
  onPostClick,
  fieldOfStudy,
  images,
  role
}) => {
  // Component state
  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const [likeCount, setLikeCount] = useState<number | undefined>(undefined);
  const [saved, setSaved] = useState<boolean | undefined>(undefined);
  const [saveCount, setSaveCount] = useState<number | undefined>(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Log props received to help debugging
  useEffect(() => {
    console.log(`Post ${id} rendered with isLiked:`, isLiked, 'likes:', likes);
  }, [id, isLiked, likes]);

  // Initialize state from props once on mount
  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(likes);
    setSaved(isSaved);
    setSaveCount(0); // Default to 0 as saves count might not be in older posts
    setIsInitializing(false);

    console.log(`Post ${id} initialized with like status:`, isLiked, 'and save status:', isSaved);
  }, [id, isLiked, likes, isSaved]);

  // Effect to update liked state if isLiked prop changes
  useEffect(() => {
    if (isLiked !== undefined && !isInitializing) {
      console.log(`Post ${id} isLiked prop changed to:`, isLiked);
      setLiked(isLiked);
    }
  }, [isLiked, id, isInitializing]);

  // Effect to update likeCount if likes prop changes
  useEffect(() => {
    if (likes !== undefined && !isInitializing) {
      console.log(`Post ${id} likes prop changed to:`, likes);
      setLikeCount(likes);
    }
  }, [likes, id, isInitializing]);

  // Effect to update saved state if isSaved prop changes
  useEffect(() => {
    if (isSaved !== undefined && !isInitializing) {
      console.log(`Post ${id} isSaved prop changed to:`, isSaved);
      setSaved(isSaved);
    }
  }, [isSaved, id, isInitializing]);

  // Additional effect to fetch and verify like status when component mounts
  useEffect(() => {
    const verifyLikeStatus = async () => {
      if (!id) {
        console.error('Cannot verify like status: post ID is missing');
        return;
      }
      
      try {
        console.log(`Verifying like status for post ${id}...`);
        const response = await fetch(`/api/posts/${id}/like`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store', // Ensure we get fresh data
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Error response for post ${id}:`, errorData);
          return;
        }
        
        const data = await response.json().catch(() => ({ liked: false, likeCount: 0 }));
        
        console.log(`Received like status for post ${id} from API:`, data);
        // Only update if necessary to avoid unnecessary re-renders
        if (data.liked !== liked && liked !== undefined) {
          console.log(`Updating like status for post ${id} from ${liked} to ${data.liked}`);
          setLiked(data.liked);
        }
        
        if (data.likeCount !== likeCount && likeCount !== undefined) {
          console.log(`Updating like count for post ${id} from ${likeCount} to ${data.likeCount}`);
          setLikeCount(data.likeCount);
        }
      } catch (error) {
        console.error(`Error verifying like status for post ${id}:`, error);
      }
    };
    
    if (!isInitializing) {
      verifyLikeStatus();
    }
  }, [id, liked, likeCount, isInitializing]);

  // Additional effect to fetch and verify save status when component mounts
  useEffect(() => {
    const verifySaveStatus = async () => {
      if (!id) {
        console.error('Cannot verify save status: post ID is missing');
        return;
      }
      
      try {
        console.log(`Verifying save status for post ${id}...`);
        const response = await fetch(`/api/posts/${id}/save`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store', // Ensure we get fresh data
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Error response for post ${id}:`, errorData);
          return;
        }
        
        const data = await response.json().catch(() => ({ saved: false, saveCount: 0 }));
        
        console.log(`Received save status for post ${id} from API:`, data);
        // Only update if necessary to avoid unnecessary re-renders
        if (data.saved !== saved && saved !== undefined) {
          console.log(`Updating save status for post ${id} from ${saved} to ${data.saved}`);
          setSaved(data.saved);
        }
        
        if (data.saveCount !== saveCount && saveCount !== undefined) {
          console.log(`Updating save count for post ${id} from ${saveCount} to ${data.saveCount}`);
          setSaveCount(data.saveCount);
        }
      } catch (error) {
        console.error(`Error verifying save status for post ${id}:`, error);
      }
    };
    
    if (!isInitializing) {
      verifySaveStatus();
    }
  }, [id, saved, saveCount, isInitializing]);

  // Check if the post has images
  const hasImages = images && images.length > 0;

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (liked === undefined || likeCount === undefined) {
      console.error('Cannot like post: like status not initialized');
      return;
    }
    
    // Optimistic UI update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    
    if (!id) {
      console.error('Post ID is missing');
      return;
    }
    
    try {
      setIsLikeLoading(true);
      console.log(`Sending like request for post ${id}...`);
      
      // Call the like API endpoint
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store', // Ensure we're not using cached responses
      });
      
      if (!response.ok) {
        // Revert optimistic update on error
        setLiked(liked);
        setLikeCount(likeCount);
        
        const errorData = await response.json().catch(() => ({}));
        console.error(`Error response for post ${id}:`, errorData);
        throw new Error(errorData.error || 'Failed to toggle like');
      }
      
      // Get updated data from response
      const data = await response.json().catch(() => ({ success: false }));
      console.log(`Like response for post ${id}:`, data);
      
      if (!data.success) {
        // Revert optimistic update if success is false
        setLiked(liked);
        setLikeCount(likeCount);
        return;
      }
      
      // Update with server values (in case of race conditions)
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      
    } catch (error) {
      // Show error message
      toast.error('Failed to like post. Please try again.');
      console.error('Error liking post:', error);
      
      // Revert optimistic update
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (saved === undefined || saveCount === undefined) {
      console.error('Cannot save post: save status not initialized');
      return;
    }
    
    // Optimistic UI update
    setSaved(!saved);
    setSaveCount(saved ? Math.max(0, saveCount - 1) : saveCount + 1);
    
    if (!id) {
      console.error('Post ID is missing');
      return;
    }
    
    try {
      setIsSaveLoading(true);
      console.log(`Sending save request for post ${id}...`);
      
      // Call the save API endpoint
      const response = await fetch(`/api/posts/${id}/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store', // Ensure we're not using cached responses
      });
      
      if (!response.ok) {
        // Revert optimistic update on error
        setSaved(saved);
        setSaveCount(saveCount);
        
        const errorData = await response.json().catch(() => ({}));
        console.error(`Error response for post ${id}:`, errorData);
        throw new Error(errorData.error || 'Failed to toggle save');
      }
      
      // Get updated data from response
      const data = await response.json().catch(() => ({ success: false }));
      console.log(`Save response for post ${id}:`, data);
      
      if (!data.success) {
        // Revert optimistic update if success is false
        setSaved(saved);
        setSaveCount(saveCount);
        return;
      }
      
      // Update with server values (in case of race conditions)
      setSaved(data.saved);
      setSaveCount(data.saveCount);
      
    } catch (error) {
      // Show error message
      toast.error('Failed to save post. Please try again.');
      console.error('Error saving post:', error);
      
      // Revert optimistic update
      setSaved(saved);
      setSaveCount(saveCount);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(id);
    } else {
      // Navigate to post detail page
      window.location.href = `/post/${id}`;
    }
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImages) {
      setImageError(false);
      setCurrentImageIndex((currentImageIndex + 1) % images!.length);
    }
  };

  const goToPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImages) {
      setImageError(false);
      setCurrentImageIndex((currentImageIndex - 1 + images!.length) % images!.length);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if author is a mentor (only mentors can be verified)
  const isMentor = isVerified !== undefined;

  // If initial state is not set yet, show a loading state
  if (liked === undefined || likeCount === undefined || saved === undefined || saveCount === undefined) {
    return (
      <div className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 animate-pulse">
        <div className="flex items-start gap-4 mb-6">
          <div className="rounded-full bg-gray-800 h-14 w-14"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-1/3"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-5 bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
          <div className="h-4 bg-gray-800 rounded w-1/6"></div>
          <div className="h-4 bg-gray-800 rounded w-1/6"></div>
          <div className="h-4 bg-gray-800 rounded w-1/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 transition-all hover:shadow-lg hover:border-gray-700 cursor-pointer" 
      onClick={handlePostClick}
    >
      <div className="flex items-start gap-4 mb-6">
        <ProfileImage src={profileImage} alt={author} size={56} className="border-2 border-gray-800" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{author}</span>
            {/* Show verification badge only for mentors */}
            {isMentor && isVerified && <FaCheck size={18} className="text-orange-500" title="Verified Mentor" />}
            
            {/* Role badge */}
            <span className={`flex items-center px-2 py-0.5 rounded-full text-xs ${role === 'mentor' ? 'bg-orange-900/40 text-orange-400' : 'bg-blue-900/40 text-blue-400'}`}>
              {role === 'mentor' ? 'Mentor' : 'Student'}
            </span>
          </div>
          <div className="text-sm text-gray-300">
            {(institution && institution !== 'Unknown Institution' && institution !== 'Default University') ? (
              <div className="flex items-center gap-1">
                <span>{institution}</span>
                {fieldOfStudy && fieldOfStudy !== 'N/A' && (
                  <span className="text-gray-400">• {fieldOfStudy}</span>
                )}
              </div>
            ) : fieldOfStudy && fieldOfStudy !== 'N/A' ? (
              <div className="flex items-center gap-1">
                <span>{fieldOfStudy}</span>
              </div>
            ) : null}
            <span className="text-gray-500 text-xs">{timeAgo}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">{content}</p>
        
        {/* Post Images */}
        {hasImages && (
          <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden bg-gray-800">
            {imageError ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaImage size={40} className="mb-2" />
                <p className="text-sm">Image could not be loaded</p>
              </div>
            ) : (
              <Image
                src={images![currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
                onError={handleImageError}
              />
            )}
            
            {/* Image navigation controls */}
            {images!.length > 1 && (
              <>
                <button 
                  onClick={goToPrevImage} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button 
                  onClick={goToNextImage} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full text-white text-xs">
                  {currentImageIndex + 1} / {images!.length}
                </div>
              </>
            )}
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
        <button 
          className={`flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors ${liked ? 'text-orange-500' : ''} ${isLikeLoading ? 'opacity-70' : ''}`}
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          aria-label="Like post"
        >
          {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          <span>{likeCount}</span>
        </button>
        
        <button 
          className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
          aria-label="Comment on post"
        >
          <FaRegComment size={20} />
          <span>{comments}</span>
        </button>
        
        <button 
          className={`ml-auto text-gray-400 hover:text-orange-500 transition-colors ${saved ? 'text-orange-500' : ''} ${isSaveLoading ? 'opacity-70' : ''}`}
          onClick={handleSaveClick}
          disabled={isSaveLoading}
          aria-label={saved ? "Unsave post" : "Save post"}
        >
          {saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Post; 