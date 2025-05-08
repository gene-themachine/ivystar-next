'use client';

import { motion } from 'framer-motion';

interface MessageBubbleProps {
  content: string;
  time: string;
  isUser: boolean;
  delay?: number;
}

export default function MessageBubble({ content, time, isUser, delay = 0 }: MessageBubbleProps) {
  return (
    <motion.div 
      className={`flex items-start gap-2 max-w-md mb-3 ${isUser ? 'self-end' : ''}`}
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {isUser && <span className="text-sm text-gray-500 mt-1 shrink-0">{time}</span>}
      <div className={`${isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-300'} rounded-xl p-3 shadow-md`}>
        <p className="text-sm">{content}</p>
      </div>
      {!isUser && <span className="text-sm text-gray-500 mt-1 shrink-0">{time}</span>}
    </motion.div>
  );
} 