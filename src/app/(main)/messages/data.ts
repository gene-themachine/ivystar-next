export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isActive: boolean;
}

export interface Message {
  id: string;
  content: string;
  time: string;
  isUser: boolean;
}

export const conversations: Conversation[] = [
  {
    id: 'prof_at_school',
    name: 'prof_at_school',
    lastMessage: "I'd be happy to review your research...",
    time: '1:42 PM',
    unread: 2,
    isActive: true
  },
  {
    id: 'code_wizard',
    name: 'code_wizard',
    lastMessage: "Let's schedule our first mentoring session",
    time: 'Yesterday',
    unread: 0,
    isActive: false
  },
  {
    id: 'tech_mentor88',
    name: 'tech_mentor88',
    lastMessage: "Thanks for your feedback on my project",
    time: 'Tuesday',
    unread: 0,
    isActive: false
  },
  {
    id: 'study_buddy42',
    name: 'study_buddy42',
    lastMessage: "Here's the resource I mentioned earlier",
    time: 'Last week',
    unread: 0,
    isActive: false
  },
  {
    id: 'research_expert',
    name: 'research_expert',
    lastMessage: "Did you check out that paper I sent?",
    time: 'Mar 28',
    unread: 0,
    isActive: false
  },
  {
    id: 'design_thinker',
    name: 'design_thinker',
    lastMessage: "The UI mockups are looking great",
    time: 'Mar 25',
    unread: 0,
    isActive: false
  }
];

export const messages: Record<string, Message[]> = {
  'prof_at_school': [
    {
      id: '1',
      content: "Hi user123, I hope you're doing well. I wanted to follow up on your research project. Have you made progress with the literature review section?",
      time: '1:30',
      isUser: false
    },
    {
      id: '2',
      content: "Hello prof_miller! Yes, I've completed about 75% of the literature review. I've found some interesting papers on the topic we discussed.",
      time: '1:35',
      isUser: true
    },
    {
      id: '3',
      content: "That's great progress! Could you send me what you have so far? I'd be happy to review it and provide feedback.",
      time: '1:40',
      isUser: false
    },
    {
      id: '4',
      content: "Also, are you planning to attend the CS department seminar next week? Dr. Zhang from MIT will be speaking about a topic related to your research.",
      time: '1:42',
      isUser: false
    },
    {
      id: '5',
      content: "I'll send over the draft by tonight. It still needs some work on the methodology section, but I'd appreciate your input on what I have so far.",
      time: '1:45',
      isUser: true
    },
    {
      id: '6',
      content: "Yes, I've registered for the seminar! I'm really looking forward to it. I've read some of Dr. Zhang's papers for my literature review actually.",
      time: '1:46',
      isUser: true
    }
  ],
  'code_wizard': [
    {
      id: '1',
      content: "Hey there! I think it's time we scheduled our first mentoring session. When are you free this week?",
      time: 'Yesterday',
      isUser: false
    },
    {
      id: '2',
      content: "Hi! I'm free on Thursday afternoon or Friday morning. What works best for you?",
      time: 'Yesterday',
      isUser: true
    }
  ],
  'tech_mentor88': [
    {
      id: '1',
      content: "Thank you for reviewing my project! Your feedback was really helpful.",
      time: 'Tuesday',
      isUser: true
    },
    {
      id: '2',
      content: "You're welcome! Your project has a lot of potential. Let me know if you have any other questions.",
      time: 'Tuesday',
      isUser: false
    }
  ],
  'study_buddy42': [
    {
      id: '1',
      content: "Here's that resource I mentioned earlier about machine learning algorithms.",
      time: 'Last week',
      isUser: false
    }
  ],
  'research_expert': [
    {
      id: '1',
      content: "Did you check out that paper I sent you about quantum computing applications?",
      time: 'Mar 28',
      isUser: false
    }
  ],
  'design_thinker': [
    {
      id: '1',
      content: "The UI mockups are looking great! I especially like the dark mode implementation.",
      time: 'Mar 25',
      isUser: false
    }
  ]
}; 