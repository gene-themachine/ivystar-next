'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MessageBubbleProps {
  content: string;
  time: string;
  isUser: boolean;
  profileImage?: string;
  username?: string;
  delay?: number;
}

export default function MessageBubble({ content, time, isUser, profileImage, username, delay = 0 }: MessageBubbleProps) {
  return (
    <motion.div
      className={`flex items-start gap-2 max-w-md mb-3 ${isUser ? 'self-end flex-row-reverse' : ''}`}
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Avatar (only for other user's messages) */}
      {!isUser && profileImage && (
        <img
          src={profileImage}
          alt={username || 'User'}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      )}

      {/* Bubble + username */}
      <div className="flex flex-col max-w-full">
        {!isUser && username && (
          <Link href={`/profile/${username}`} className="text-xs text-blue-400 hover:underline mb-0.5 truncate w-max">
            {username}
          </Link>
        )}
        <div className={`${isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-300'} rounded-xl p-3 shadow-md break-words`}>
          <p className="text-sm">{content}</p>
        </div>
      </div>

      {/* Timestamp */}
      <span className="text-xs text-gray-500 mt-1 shrink-0">{time}</span>
    </motion.div>
  );
} 