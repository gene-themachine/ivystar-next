'use client'

import React, { useState } from 'react';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaCheck } from 'react-icons/fa';
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
  fieldOfStudy
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(isSaved);

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

  return (
    <div 
      className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 transition-all hover:shadow-lg hover:border-gray-700 cursor-pointer" 
      onClick={handlePostClick}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={profileImage} 
            alt={author} 
            width={56} 
            height={56}
            className="rounded-full object-cover w-full h-full border-2 border-gray-800"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-profile.png';
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{author}</span>
            {isVerified && <FaCheck size={18} className="text-orange-500" />}
          </div>
          <div className="text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <span>{institution}</span>
              {fieldOfStudy && <span className="text-gray-400">• {fieldOfStudy}</span>}
            </div>
            <span className="text-gray-500 text-xs">{timeAgo} • {community}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">{content}</p>
        
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