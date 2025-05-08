'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { sendMessage } from '@/lib/firebase-chat';

interface Message {
  id: string;
  content: string;
  time: string;
  isUser?: boolean;
  senderId?: string;
  senderName?: string;
}

interface ChatAreaProps {
  conversationId: string;
  messages: Message[];
  userId?: string | null;
  userName?: string;
  recipientName?: string;
}

export default function ChatArea({ conversationId, messages, userId, userName = '', recipientName = 'User' }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [userMap, setUserMap] = useState<Record<string, { username: string; profilePhoto: string }>>({});

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch user info for message senders
  useEffect(() => {
    const senderIds = messages
      .map((m) => m.senderId)
      .filter((id): id is string => typeof id === 'string');

    const uniqueSenderIds = senderIds.filter((id, idx) => senderIds.indexOf(id) === idx && !(id in userMap));

    if (uniqueSenderIds.length === 0) return;

    // Fetch all unknown users in parallel
    Promise.all(
      uniqueSenderIds.map((id) =>
        fetch(`/api/users/${id}`).then((res) => (res.ok ? res.json() : null))
      )
    )
      .then((results) => {
        const updates: Record<string, { username: string; profilePhoto: string }> = {};
        results.forEach((data, idx) => {
          if (data) {
            updates[uniqueSenderIds[idx]] = {
              username: data.username,
              profilePhoto: data.profilePhoto,
            };
          }
        });
        if (Object.keys(updates).length > 0) {
          setUserMap((prev) => ({ ...prev, ...updates }));
        }
      })
      .catch((err) => console.error('Error fetching user info for messages', err));
  }, [messages, userMap]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;
    
    try {
      setIsSending(true);
      await sendMessage(conversationId, newMessage, userId, userName);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="h-16 px-5 border-b border-gray-700 flex items-center justify-between bg-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-medium text-lg text-white truncate max-w-xs">{recipientName}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto bg-gray-900 scrollbar-none">
        <div className="flex flex-col space-y-0 max-w-3xl mx-auto p-5">
          {/* Timestamp */}
          {messages.length > 0 && (
            <div className="flex justify-center my-3">
              <span className="text-sm text-gray-400 px-4 py-1.5 rounded-full bg-gray-800/80 border border-gray-700 backdrop-blur-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          )}
          
          {/* Messages */}
          {messages.map((message, index) => {
            // Determine if the current user is the sender of this message
            const isSelf = message.senderId
              ? message.senderId === userId
              : message.isUser || false;

            const senderInfo = message.senderId ? userMap[message.senderId] : undefined;

            return (
              <MessageBubble
                key={message.id}
                content={message.content}
                time={message.time}
                isUser={isSelf}
                profileImage={senderInfo?.profilePhoto}
                username={senderInfo?.username || message.senderName}
                delay={index * 0.1}
              />
            );
          })}
          
          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 py-2.5 px-5 bg-gray-700 border border-gray-600 rounded-full focus:ring-1 focus:ring-blue-500 focus:outline-none text-base text-gray-200"
            disabled={isSending}
          />
          <motion.button 
            className={`p-2 rounded-full ${isSending ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
            whileHover={{ scale: isSending ? 1.0 : 1.05 }}
            whileTap={{ scale: isSending ? 1.0 : 0.95 }}
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            aria-label="Send message"
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
} 