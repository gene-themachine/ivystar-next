'use client';

import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  content: string;
  time: string;
  isUser: boolean;
}

interface ChatAreaProps {
  conversationId: string;
  messages: Message[];
}

export default function ChatArea({ conversationId, messages }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="h-16 px-5 border-b border-gray-700 flex items-center justify-between bg-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-medium text-lg text-white">{conversationId}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-900 scrollbar-none">
        <div className="flex flex-col space-y-0 max-w-3xl mx-auto p-5">
          {/* Timestamp */}
          <div className="flex justify-center my-3">
            <span className="text-sm text-gray-400 px-4 py-1.5 rounded-full bg-gray-800/80 border border-gray-700 backdrop-blur-sm">Today, 1:30 PM</span>
          </div>
          
          {/* Messages */}
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              time={message.time}
              isUser={message.isUser}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
      
      {/* Message Input */}
      <div className="p-3 border-t border-gray-700 bg-gray-800 shrink-0">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Attach file">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 py-2.5 px-5 bg-gray-700 border border-gray-600 rounded-full focus:ring-1 focus:ring-blue-500 focus:outline-none text-base text-gray-200"
          />
          <motion.button 
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Send message"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 