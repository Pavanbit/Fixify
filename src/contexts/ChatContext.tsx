import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  jobId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ChatContextType {
  messages: Message[];
  jobChats: Record<string, Message[]>;
  sendMessage: (jobId: string, receiverId: string, content: string) => Promise<void>;
  getJobMessages: (jobId: string) => Message[];
  markAsRead: (messageIds: string[]) => void;
  getUnreadCount: (jobId: string) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    jobId: 'job-3',
    senderId: 'user-3',
    receiverId: 'worker-1',
    content: 'Hi, are you available to start the bookshelf project this week?',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true
  },
  {
    id: 'msg-2',
    jobId: 'job-3',
    senderId: 'worker-1',
    receiverId: 'user-3',
    content: 'Yes, I can start on Thursday. Would that work for you?',
    timestamp: new Date(Date.now() - 82800000).toISOString(),
    read: true
  },
  {
    id: 'msg-3',
    jobId: 'job-3',
    senderId: 'user-3',
    receiverId: 'worker-1',
    content: 'Thursday works great. What time should I expect you?',
    timestamp: new Date(Date.now() - 79200000).toISOString(),
    read: false
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobChats, setJobChats] = useState<Record<string, Message[]>>({});

  // Load mock messages on initial load
  useEffect(() => {
    const savedMessages = localStorage.getItem('fixify_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(mockMessages);
      localStorage.setItem('fixify_messages', JSON.stringify(mockMessages));
    }
  }, []);

  // Group messages by job
  useEffect(() => {
    const chats: Record<string, Message[]> = {};
    
    messages.forEach(message => {
      if (!chats[message.jobId]) {
        chats[message.jobId] = [];
      }
      chats[message.jobId].push(message);
    });
    
    // Sort messages by timestamp
    Object.keys(chats).forEach(jobId => {
      chats[jobId].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    
    setJobChats(chats);
  }, [messages]);

  const sendMessage = async (jobId: string, receiverId: string, content: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!currentUser) throw new Error('User must be logged in to send a message');
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('fixify_messages', JSON.stringify(updatedMessages));
  };

  const getJobMessages = (jobId: string) => {
    return jobChats[jobId] || [];
  };

  const markAsRead = (messageIds: string[]) => {
    const updatedMessages = messages.map(message => {
      if (messageIds.includes(message.id)) {
        return { ...message, read: true };
      }
      return message;
    });
    
    setMessages(updatedMessages);
    localStorage.setItem('fixify_messages', JSON.stringify(updatedMessages));
  };

  const getUnreadCount = (jobId: string) => {
    if (!currentUser) return 0;
    
    return (jobChats[jobId] || []).filter(
      message => message.receiverId === currentUser.id && !message.read
    ).length;
  };

  const value = {
    messages,
    jobChats,
    sendMessage,
    getJobMessages,
    markAsRead,
    getUnreadCount
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};