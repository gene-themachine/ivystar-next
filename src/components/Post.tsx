'use client'

import React, { useState } from 'react';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaCheck } from 'react-icons/fa';

interface PostProps {
  id: string;
  author: string;
  isVerified: boolean;
  profileImage: string;
  institution: string;
  timeAgo: string;
  community: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  hasMentorResponse: boolean;
  onPostClick?: (id: string) => void;
  fieldOfStudy?: string;
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
  hasMentorResponse,
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-md hover:border-gray-200 cursor-pointer" onClick={handlePostClick}>
      <div className="flex items-start gap-3 mb-7">
        <img src={profileImage} alt={author} className="w-12 h-12 rounded-full object-cover border-2 border-gray-50 shadow-sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{author}</span>
            {isVerified && <FaCheck size={14} color="#4B5563" />}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>{institution}</span>
              {fieldOfStudy && <span className="font-medium">in {fieldOfStudy}</span>}
            </div>
            <span className="text-gray-500">{timeAgo}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700 leading-relaxed mb-4">{content}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {hasMentorResponse && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-900 rounded-full text-sm font-medium">
            <span>🎓</span>
            <span>Mentor Response</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button 
          className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${liked ? 'text-red-500' : ''}`}
          onClick={handleLikeClick}
        >
          {liked ? <FaHeart size={16} color="#EF4444" /> : <FaRegHeart size={16} />}
          <span>{likeCount}</span>
        </button>
        
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <FaRegComment size={16} />
          <span>{comments}</span>
        </button>
        
        <button 
          className={`ml-auto text-gray-600 hover:text-gray-900 transition-colors ${saved ? 'text-gray-900' : ''}`}
          onClick={handleSaveClick}
        >
          {saved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Post; 