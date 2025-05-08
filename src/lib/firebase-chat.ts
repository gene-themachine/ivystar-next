import { collection, query, where, orderBy, getDocs, addDoc, doc, serverTimestamp, onSnapshot, getDoc, updateDoc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { currentUser } from '@clerk/nextjs/server';
import { useAuth } from '@clerk/nextjs';

// Types
export interface Message {
  id: string;
  content: string;
  time: string;
  timestamp: Timestamp;
  isUser: boolean;
  senderId: string;
  senderName: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  timestamp: Timestamp;
  unread: number;
  isActive: boolean;
  participants: string[];
  participantNames: Record<string, string>;
}

/**
 * Get all conversations for the current user (client-side)
 */
export function useUserConversations() {
  const { userId } = useAuth();
  
  // Implement the client-side hook
  // This would be implemented with useEffect/useState/etc.
}

/**
 * Get all conversations for the current user (server-side)
 */
export async function getUserConversations(userId: string) {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    const conversations: Conversation[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const otherParticipantId = getOtherParticipantId(data.participants, userId);
      const otherParticipantName = data.participantNames?.[otherParticipantId] || otherParticipantId;
      
      conversations.push({
        id: doc.id,
        name: otherParticipantName,
        lastMessage: data.lastMessage || "No messages yet",
        time: formatTimestamp(data.timestamp),
        timestamp: data.timestamp,
        unread: data.unreadCounts ? data.unreadCounts[userId] || 0 : 0,
        isActive: false,
        participants: data.participants,
        participantNames: data.participantNames || {}
      });
    });
    
    return conversations;
  } catch (error) {
    console.error("Error getting conversations:", error);
    return [];
  }
}

/**
 * Get real-time updates for user conversations
 */
export function subscribeToUserConversations(userId: string, callback: (conversations: Conversation[]) => void) {
  if (!userId) {
    console.error("User not authenticated");
    return () => {};
  }
  
  const conversationsRef = collection(db, "conversations");
  const q = query(
    conversationsRef,
    where("participants", "array-contains", userId),
    orderBy("timestamp", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const conversations: Conversation[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const otherParticipantId = getOtherParticipantId(data.participants, userId);
      const otherParticipantName = data.participantNames?.[otherParticipantId] || otherParticipantId;
      
      conversations.push({
        id: doc.id,
        name: otherParticipantName,
        lastMessage: data.lastMessage || "No messages yet",
        time: formatTimestamp(data.timestamp),
        timestamp: data.timestamp,
        unread: data.unreadCounts ? data.unreadCounts[userId] || 0 : 0,
        isActive: false,
        participants: data.participants,
        participantNames: data.participantNames || {}
      });
    });
    
    callback(conversations);
  });
}

/**
 * Get messages for a specific conversation
 */
export async function getMessagesForConversation(conversationId: string, userId: string) {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Mark messages as read
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      const conversationData = conversationDoc.data();
      const unreadCounts = conversationData.unreadCounts ? { ...conversationData.unreadCounts } : {};
      
      // Reset unread count for current user
      if (unreadCounts[userId]) {
        unreadCounts[userId] = 0;
        await updateDoc(conversationRef, { unreadCounts });
      }
    }
    
    // Get messages
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    const messages: Message[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        content: data.content,
        time: formatMessageTime(data.timestamp),
        timestamp: data.timestamp,
        isUser: data.senderId === userId,
        senderId: data.senderId,
        senderName: data.senderName
      });
    });
    
    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
}

/**
 * Get real-time updates for messages in a conversation
 */
export function subscribeToMessages(conversationId: string, userId: string, callback: (messages: Message[]) => void) {
  if (!userId) {
    console.error("User not authenticated");
    return () => {};
  }
  
  // Mark conversation as read when subscribing
  const conversationRef = doc(db, "conversations", conversationId);
  getDoc(conversationRef).then((conversationDoc) => {
    if (conversationDoc.exists()) {
      const conversationData = conversationDoc.data();
      const unreadCounts = conversationData.unreadCounts ? { ...conversationData.unreadCounts } : {};
      
      // Reset unread count for current user
      if (unreadCounts[userId]) {
        unreadCounts[userId] = 0;
        updateDoc(conversationRef, { unreadCounts });
      }
    }
  });
  
  // Subscribe to messages
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const q = query(messagesRef, orderBy("timestamp"));
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        content: data.content,
        time: formatMessageTime(data.timestamp),
        timestamp: data.timestamp,
        isUser: data.senderId === userId,
        senderId: data.senderId,
        senderName: data.senderName
      });
    });
    
    callback(messages);
  });
}

/**
 * Send a message to a conversation
 */
export async function sendMessage(conversationId: string, content: string, userId: string, senderName: string) {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Get conversation reference
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (!conversationDoc.exists()) {
      throw new Error("Conversation not found");
    }
    
    const conversationData = conversationDoc.data();
    const otherParticipants = conversationData.participants.filter(
      (id: string) => id !== userId
    );
    
    // Update unread counts for other participants
    const unreadCounts = conversationData.unreadCounts ? { ...conversationData.unreadCounts } : {};
    otherParticipants.forEach((participantId: string) => {
      unreadCounts[participantId] = (unreadCounts[participantId] || 0) + 1;
    });
    
    // Add message to conversation
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const timestamp = serverTimestamp();
    
    await addDoc(messagesRef, {
      content,
      senderId: userId,
      senderName,
      timestamp,
    });
    
    // Update conversation with last message
    await updateDoc(conversationRef, {
      lastMessage: content,
      timestamp,
      unreadCounts
    });
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
}

/**
 * Create a new conversation with another user
 */
export async function createConversation(otherUserId: string, initialMessage: string, userId: string, senderName: string, recipientName: string) {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Check if conversation already exists
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId)
    );
    
    const querySnapshot = await getDocs(q);
    let existingConversationId: string | null = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(otherUserId)) {
        existingConversationId = doc.id;
      }
    });
    
    // If conversation exists, send message to it
    if (existingConversationId) {
      await sendMessage(existingConversationId, initialMessage, userId, senderName);
      return existingConversationId;
    }
    
    // Create new conversation with participant names
    const timestamp = serverTimestamp();
    const conversationRef = doc(collection(db, "conversations"));
    
    // Create a map of user IDs to names
    const participantNames: Record<string, string> = {
      [userId]: senderName,
      [otherUserId]: recipientName
    };
    
    await setDoc(conversationRef, {
      participants: [userId, otherUserId],
      participantNames: participantNames,
      lastMessage: initialMessage,
      timestamp,
      unreadCounts: {
        [otherUserId]: 1
      }
    });
    
    // Add initial message
    const messagesRef = collection(db, "conversations", conversationRef.id, "messages");
    
    await addDoc(messagesRef, {
      content: initialMessage,
      senderId: userId,
      senderName,
      timestamp
    });
    
    return conversationRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
}

// Helper function to get the name of the other participant
function getOtherParticipantId(participants: string[], currentUserId: string): string {
  const otherParticipantId = participants.find(id => id !== currentUserId);
  return otherParticipantId || 'Unknown';
}

// Helper function to format timestamps
function formatTimestamp(timestamp: Timestamp | null): string {
  if (!timestamp) {
    return 'Just now';
  }
  
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  
  if (diff < minute) {
    return 'Just now';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Format message time (HH:MM)
function formatMessageTime(timestamp: Timestamp | null): string {
  if (!timestamp) {
    return '';
  }
  
  const date = timestamp.toDate();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
} 