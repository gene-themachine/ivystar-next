'use client';

import { useState } from 'react';
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';
import { conversations, messages } from './data';

export default function Messages() {
  const [activeConversation, setActiveConversation] = useState('prof_at_school');
  
  return (
    <div className="bg-gray-950">
      <div className="h-[calc(100vh-64px)] flex overflow-hidden">
        {/* Conversation List */}
        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
        />
        
        {/* Chat Area */}
        <ChatArea 
          conversationId={activeConversation}
          messages={messages[activeConversation] || []}
        />
      </div>
    </div>
  );
}
