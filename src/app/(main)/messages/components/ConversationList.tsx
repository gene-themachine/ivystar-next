'use client';

import { motion } from 'framer-motion';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isActive: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string;
  setActiveConversation: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversation,
  setActiveConversation
}: ConversationListProps) {
  return (
    <div className="w-80 border-r border-gray-700 flex flex-col bg-gray-800 overflow-hidden">
      <div className="p-3 border-b border-gray-700 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full py-2 pl-9 pr-3 bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <div className="absolute top-2.5 left-3 text-gray-400">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 scrollbar-none">
        {conversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            className={`py-3 px-4 cursor-pointer transition-colors border-b border-gray-700 ${
              activeConversation === conversation.id 
                ? 'bg-gray-700 border-l-2 border-blue-500' 
                : 'hover:bg-gray-700 border-l-2 border-transparent'
            }`}
            onClick={() => setActiveConversation(conversation.id)}
            whileHover={{ 
              backgroundColor: activeConversation === conversation.id ? '' : 'rgba(55, 65, 81, 1)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`font-medium text-sm truncate ${
                    activeConversation === conversation.id ? 'text-white' : 'text-gray-200'
                  }`}>{conversation.name}</p>
                </div>
                <p className={`text-sm truncate mt-1 ${
                  activeConversation === conversation.id ? 'text-gray-300' : 'text-gray-400'
                }`}>{conversation.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-xs text-gray-400">{conversation.time}</span>
                {conversation.unread > 0 && (
                  <motion.span 
                    className="w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {conversation.unread}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 