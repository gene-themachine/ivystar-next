'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaCheck, FaArrowLeft, FaImage } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ProfileImage from '@/components/ProfileImage';

interface Comment {
  id: string;
  author: string;
  profileImage: string;
  content: string;
  isVerified: boolean;
  institution: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

interface PostDetail {
  _id: string;
  title: string;
  content: string;
  author: {
    clerkId: string;
    username: string;
    profileImage?: string;
    institution?: string;
    isVerified?: boolean;
    role?: 'mentor' | 'student';
  };
  images?: string[];
  tags?: string[];
  likes: number;
  likedBy: string[];
  comments: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isSaved: boolean;
  commentsList: Comment[];
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<PostDetail | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  
  // Comment state
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/${postId}`, {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        console.log('Post data:', data);
        
        if (!data.post) {
          throw new Error('Post data is missing');
        }
        
        setPost(data.post);
        setLiked(data.post.isLiked);
        setSaved(data.post.isSaved);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
        toast.error('Could not load post. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
  const handleLikeClick = async () => {
    if (!post) return;
    
    try {
      setIsLikeLoading(true);
      
      // Optimistic UI update
      setLiked(!liked);
      
      // Call the like API endpoint
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        // Revert optimistic update on error
        setLiked(liked);
        throw new Error('Failed to toggle like');
      }
      
      // Get updated data
      const data = await response.json();
      
      // No need to update state again if successful - our optimistic update is enough
    } catch (error) {
      toast.error('Failed to like post. Please try again.');
      console.error('Error liking post:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  const handleSaveClick = async () => {
    if (!post) return;
    
    try {
      setIsSaveLoading(true);
      
      // Optimistic UI update
      setSaved(!saved);
      
      // Call the save API endpoint
      const response = await fetch(`/api/posts/${post._id}/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        // Revert optimistic update on error
        setSaved(saved);
        throw new Error('Failed to toggle save');
      }
      
      // Get updated data
      const data = await response.json();
      
      // No need to update state again if successful - our optimistic update is enough
    } catch (error) {
      toast.error('Failed to save post. Please try again.');
      console.error('Error saving post:', error);
    } finally {
      setIsSaveLoading(false);
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmittingComment(true);
      
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentText }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const data = await response.json();
      
      // Update local state with the new comment
      setPost(prevPost => {
        if (!prevPost) return null;
        
        return {
          ...prevPost,
          comments: prevPost.comments + 1,
          commentsList: [data.comment, ...prevPost.commentsList]
        };
      });
      
      // Clear the input
      setCommentText('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const goToNextImage = () => {
    if (post?.images && post.images.length > 0) {
      setImageError(false);
      setCurrentImageIndex((currentImageIndex + 1) % post.images.length);
    }
  };
  
  const goToPrevImage = () => {
    if (post?.images && post.images.length > 0) {
      setImageError(false);
      setCurrentImageIndex((currentImageIndex - 1 + post.images.length) % post.images.length);
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-950 min-h-screen">
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-400">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-gray-950 min-h-screen">
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-300 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleGoBack} 
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Post not found
  if (!post) {
    return (
      <div className="bg-gray-950 min-h-screen">
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-gray-300 mb-4">Post Not Found</h2>
            <p className="text-gray-400 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={handleGoBack} 
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine role based on verification
  const isMentor = post.author.role === 'mentor';
  const hasImages = post.images && post.images.length > 0;
  
  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
        
        <article className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 mb-8">
          {/* Author information */}
          <div className="flex items-start gap-4 mb-6">
            <ProfileImage 
              src={post.author.profileImage} 
              alt={post.author.username} 
              size={56} 
              className="border-2 border-gray-800" 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{post.author.username}</span>
                {/* Show verification badge only for mentors */}
                {isMentor && post.author.isVerified && (
                  <FaCheck size={18} className="text-orange-500" title="Verified Mentor" />
                )}
                
                {/* Display role */}
                {isMentor ? (
                  <span className="flex items-center bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full text-xs">
                    Mentor
                  </span>
                ) : (
                  <span className="flex items-center bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                    Student
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-300">
                {post.author.institution && post.author.institution !== 'Unknown Institution' && (
                  <span>{post.author.institution}</span>
                )}
                <span className="text-gray-500 text-xs block"></span>
              </div>
            </div>
          </div>
          
          {/* Post title and content */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
            <div className="text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
              {post.content}
            </div>
            
            {/* Post Images */}
            {hasImages && (
              <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden bg-gray-800">
                {imageError ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FaImage size={40} className="mb-2" />
                    <p className="text-sm">Image could not be loaded</p>
                  </div>
                ) : (
                  <Image
                    src={post.images![currentImageIndex]}
                    alt={`Post image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    unoptimized
                    onError={handleImageError}
                  />
                )}
                
                {/* Image navigation controls */}
                {post.images && post.images.length > 1 && (
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
                      {currentImageIndex + 1} / {post.images.length}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
            <button 
              className={`flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors ${liked ? 'text-orange-500' : ''} ${isLikeLoading ? 'opacity-70' : ''}`}
              onClick={handleLikeClick}
              disabled={isLikeLoading}
              aria-label="Like post"
            >
              {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
              <span>{post.likedBy.length}</span>
            </button>
            
            <button 
              className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
              onClick={() => {
                // Scroll to comments section
                document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Comment on post"
            >
              <FaRegComment size={20} />
              <span>{post.commentsList.length}</span>
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
        </article>
        
        {/* Comments Section */}
        <div id="comments-section" className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Comments</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
              <textarea
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#0387D0] transition resize-y"
                rows={3}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className={`px-4 py-2 bg-[#0387D0] text-white font-medium rounded-md hover:bg-[#0387D0]/90 transition ${(isSubmittingComment || !commentText.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>
          
          {/* Comments List */}
          <div className="space-y-4">
            {post.commentsList.length === 0 ? (
              <p className="text-center text-gray-400 py-6">No comments yet. Be the first to comment!</p>
            ) : (
              post.commentsList.map((comment) => (
                <div key={comment.id} className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
                  <div className="flex items-start gap-3">
                    <ProfileImage 
                      src={comment.profileImage} 
                      alt={comment.author} 
                      size={40} 
                      className="border-2 border-gray-800" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{comment.author}</span>
                        {comment.isVerified && (
                          <FaCheck size={16} className="text-orange-500" title="Verified Mentor" />
                        )}
                        {comment.institution && (
                          <span className="text-xs text-gray-400">{comment.institution}</span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{comment.timeAgo}</span>
                        <button className="flex items-center gap-1 hover:text-orange-500 transition">
                          <FaRegHeart size={12} />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="hover:text-orange-500 transition">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
