'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { conversations, messages } from '../../messages/data';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Types from messages page
interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isActive: boolean;
}

interface Message {
  id: string;
  content: string;
  time: string;
  isUser: boolean;
}

// Client component that takes a string ID
export function MessagePageClient({ id }: { id: string }) {
  const router = useRouter();
  const [conversationData, setConversationData] = useState<Conversation | null>(null);
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  
  // Format name from ID when no actual name is available
  const getDisplayName = (userId: string) => {
    // If it starts with "user_", remove it
    const cleanId = userId.startsWith('user_') ? userId.substring(5) : userId;
    
    // Convert to title case if it looks like a username
    if (cleanId.match(/^[a-z0-9_]+$/i)) {
      return cleanId
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
    
    // If ID is long (likely a UUID or complex ID), use a generic name
    if (cleanId.length > 8) {
      return "User";
    }
    
    return cleanId;
  };

  useEffect(() => {
    // Simulate fetching conversation data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if conversation exists in our mock data
        const conversation = conversations.find(c => c.id === id);
        
        if (conversation) {
          setConversationData(conversation);
          setMessageData(messages[id] || []);
        } else {
          // Generate a more user-friendly display name
          const displayName = getDisplayName(id);
          
          // If conversation doesn't exist, create a new one
          // In a real app, this would be handled through an API
          const newConversation: Conversation = {
            id,
            name: displayName,
            lastMessage: "Start a conversation...",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            isActive: true
          };
          
          setConversationData(newConversation);
          setMessageData([]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle back to messages
  const handleBack = () => {
    router.push('/messages');
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    
    setMessageData(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate a response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now()}`,
        content: "Thanks for your message! I'll get back to you soon.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      
      setMessageData(prev => [...prev, responseMessage]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Navigation header */}
      <div className="bg-gray-900 border-b border-gray-800 py-2 px-4 flex items-center shrink-0">
        <div className="flex items-center">
          <Link href="/messages" className="text-gray-400 hover:text-white mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-md font-medium text-white truncate">{conversationData?.name || getDisplayName(id)}</h1>
        </div>
      </div>

      {/* Main container - use flex-1 to fill available height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gray-950 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div className="flex flex-col space-y-0 max-w-3xl w-full mx-auto p-5">
            {/* Timestamp */}
            <div className="flex justify-center my-3">
              <span className="text-sm text-gray-500 px-4 py-1.5 rounded-full bg-gray-900">
                Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {/* Messages */}
            {messageData.map((message, index) => (
              <motion.div 
                key={message.id}
                className={`flex items-start gap-2 max-w-md mb-3 ${message.isUser ? 'self-end' : ''}`}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {message.isUser && <span className="text-sm text-gray-500 mt-1 shrink-0">{message.time}</span>}
                <div className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'} rounded-xl p-3 shadow-md`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                {!message.isUser && <span className="text-sm text-gray-500 mt-1 shrink-0">{message.time}</span>}
              </motion.div>
            ))}
            
            {messageData.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Start a conversation by sending a message below</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Message Input - always at the bottom */}
        <div className="p-3 border-t border-gray-800 bg-gray-900 shrink-0">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Attach file">
              <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 py-2.5 px-5 bg-gray-800 border border-gray-700 rounded-full focus:outline-none text-base text-gray-300 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            
            <motion.button 
              onClick={handleSendMessage}
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
    </div>
  );
} 