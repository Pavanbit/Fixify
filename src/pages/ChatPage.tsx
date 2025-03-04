import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobContext';
import { useChat } from '../contexts/ChatContext';
import { format } from 'date-fns';

const ChatPage: React.FC = () => {
  const { jobId, userId } = useParams<{ jobId: string; userId: string }>();
  const { currentUser } = useAuth();
  const { getJobById } = useJobs();
  const { getJobMessages, sendMessage, markAsRead } = useChat();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const job = jobId ? getJobById(jobId) : undefined;
  const messages = jobId ? getJobMessages(jobId) : [];
  
  // Determine chat partner
  const chatPartner = job ? (
    currentUser?.id === job.userId ? 
      { id: job.workerId, name: job.workerName, image: job.workerImage } : 
      { id: job.userId, name: job.userName, image: job.userImage }
  ) : undefined;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (jobId && currentUser) {
      const unreadMessages = messages
        .filter(msg => msg.receiverId === currentUser.id && !msg.read)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [jobId, messages, currentUser, markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !jobId || !userId || !currentUser) return;
    
    try {
      setIsSending(true);
      await sendMessage(jobId, userId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!job || !chatPartner) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 mb-4">Job or chat partner not found</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to={`/job/${jobId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Job
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <img
            src={chatPartner.image || `https://ui-avatars.com/api/?name=${chatPartner.name}&background=random`}
            alt={chatPartner.name}
            className="h-10 w-10 rounded-full mr-3"
          />
          <div>
            <h2 className="text-lg font-medium text-gray-900">{chatPartner.name}</h2>
            <p className="text-sm text-gray-500">
              {job.title}
            </p>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isCurrentUser = currentUser?.id === msg.senderId;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                        isCurrentUser 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p 
                        className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;