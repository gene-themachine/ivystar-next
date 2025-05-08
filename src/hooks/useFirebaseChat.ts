import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { 
  Conversation, 
  Message, 
  subscribeToUserConversations, 
  subscribeToMessages, 
  sendMessage as sendFirebaseMessage,
  createConversation as createFirebaseConversation 
} from '@/lib/firebase-chat';

export function useFirebaseChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const { user } = useUser();
  
  // Get user name for sending messages - fixed to use unsafeMetadata
  const userName = (user?.unsafeMetadata?.username as string) || user?.username || user?.firstName || '';
  
  // Subscribe to conversations
  useEffect(() => {
    if (!userId) return;
    
    setIsLoading(true);
    
    const unsubscribe = subscribeToUserConversations(userId, (data) => {
      setConversations(data);
      
      // Set active conversation to the first one if none is selected
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0].id);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      unsubscribe();
    };
  }, [userId, activeConversation]);
  
  // Subscribe to messages for active conversation
  useEffect(() => {
    if (!userId || !activeConversation) return;
    
    const unsubscribe = subscribeToMessages(activeConversation, userId, (data) => {
      setMessages(data);
    });
    
    return () => {
      unsubscribe();
    };
  }, [userId, activeConversation]);
  
  // Send a message to the active conversation
  const sendMessage = async (content: string) => {
    if (!userId || !activeConversation || !content.trim()) return false;
    
    try {
      await sendFirebaseMessage(activeConversation, content, userId, userName);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };
  
  // Start a new conversation with a user
  const startConversation = async (otherUserId: string, initialMessage: string, recipientName: string = 'User') => {
    if (!userId || !otherUserId || !initialMessage.trim()) return null;
    
    try {
      const conversationId = await createFirebaseConversation(
        otherUserId, 
        initialMessage, 
        userId, 
        userName,
        recipientName
      );
      
      if (conversationId) {
        setActiveConversation(conversationId);
      }
      
      return conversationId;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };
  
  return {
    conversations,
    messages,
    activeConversation,
    isLoading,
    setActiveConversation,
    sendMessage,
    startConversation,
  };
} 