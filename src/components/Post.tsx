'use client'

import React, { useState } from 'react';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaCheck, FaGraduationCap, FaChalkboardTeacher, FaImage } from 'react-icons/fa';
import { PostType } from '@/types';
import Image from 'next/image';

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
  community,
  title,
  content,
  tags,
  likes,
  comments,
  isLiked,
  isSaved,
  onPostClick,
  fieldOfStudy,
  images
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(isSaved);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Check if the post has images
  const hasImages = images && images.length > 0;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(id);
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

  return (
    <div 
      className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 transition-all hover:shadow-lg hover:border-gray-700 cursor-pointer" 
      onClick={handlePostClick}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={profileImage || '/images/default-profile.png'} 
            alt={author} 
            width={56} 
            height={56}
            className="rounded-full object-cover w-full h-full border-2 border-gray-800"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-profile.png';
            }}
            unoptimized
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{author}</span>
            {/* Show verification badge only for mentors */}
            {isMentor && isVerified && <FaCheck size={18} className="text-orange-500" title="Verified Mentor" />}
            
            {/* Display role icon */}
            {isMentor ? (
              <span className="flex items-center bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full text-xs">
                <FaChalkboardTeacher className="mr-1" size={10} />
                Mentor
              </span>
            ) : (
              <span className="flex items-center bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                <FaGraduationCap className="mr-1" size={10} />
                Student
              </span>
            )}
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
            <span className="text-gray-500 text-xs">{timeAgo} • {community}</span>
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
          className={`flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors ${liked ? 'text-orange-500' : ''}`}
          onClick={handleLikeClick}
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
          className={`ml-auto text-gray-400 hover:text-orange-500 transition-colors ${saved ? 'text-orange-500' : ''}`}
          onClick={handleSaveClick}
          aria-label={saved ? "Unsave post" : "Save post"}
        >
          {saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Post; 