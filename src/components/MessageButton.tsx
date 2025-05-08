'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/lib/firebase-chat';
import { useAuth } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

interface MessageButtonProps {
  recipientId: string;
  recipientName?: string;
  className?: string;
}

export default function MessageButton({ recipientId, recipientName = 'User', className = '' }: MessageButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };
  
  const handleStartConversation = async () => {
    if (!userId || !recipientId || !message.trim()) return;
    
    try {
      setIsSending(true);
      const senderName = (user?.unsafeMetadata?.username as string) || user?.username || user?.firstName || 'User';
      
      const conversationId = await createConversation(
        recipientId, 
        message, 
        userId, 
        senderName,
        recipientName
      );
      
      if (conversationId) {
        handleCloseModal();
        router.push('/messages');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors ${className}`}
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Message
      </button>
      
      {/* Modal for starting a conversation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div 
            className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-5 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Message {recipientName}</h3>
            </div>
            
            <div className="p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>
            
            <div className="px-5 py-4 flex justify-end gap-3 border-t border-gray-700">
              <button
                onClick={handleCloseModal}
                className="py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartConversation}
                disabled={isSending || !message.trim()}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isSending || !message.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 