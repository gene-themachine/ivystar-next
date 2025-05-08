'use client';

import ConversationList from '../../../components/Message/ConversationList';
import ChatArea from '../../../components/Message/ChatArea';
import { motion } from 'framer-motion';
import { useFirebaseChat } from '@/hooks/useFirebaseChat';
import { useAuth } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

export default function Messages() {
  const { 
    conversations, 
    messages, 
    activeConversation, 
    isLoading, 
    setActiveConversation 
  } = useFirebaseChat();
  
  const { userId } = useAuth();
  const { user } = useUser();
  
  // Find the active conversation object to get the recipient name
  const activeConversationData = conversations.find(conv => conv.id === activeConversation);
  
  return (
    <div className="h-full bg-gray-950">
      <div className="h-full flex overflow-hidden">
        {/* Conversation List */}
        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
          isLoading={isLoading}
        />
        
        {/* Chat Area or Empty State */}
        {activeConversation ? (
          <ChatArea 
            conversationId={activeConversation}
            messages={messages}
            userId={userId}
            userName={user?.username || user?.firstName || ''}
            recipientName={activeConversationData?.name || 'User'}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <motion.div 
              className="text-center p-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">No Conversations Yet</h3>
              <p className="text-gray-400 mb-6">
                {isLoading ? "Loading your conversations..." : 
                  "You don't have any messages yet. Start a conversation from a profile."}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
