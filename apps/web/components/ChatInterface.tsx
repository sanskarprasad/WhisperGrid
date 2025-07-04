"use client";
import { useState, useEffect, useRef } from "react";
import { useSocketStore } from "../store/useSocketStore";

interface ChatInterfaceProps {
  username: string;
  roomId: string;
  onLeaveRoom: () => void;
}

export default function ChatInterface({ username, roomId, onLeaveRoom }: ChatInterfaceProps) {
  const { messages, sendMessage, userCount, userList } = useSocketStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim(), roomId, username);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp?: string) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Room {roomId}</h1>
            <p className="text-sm text-gray-400">
              {userCount} {userCount === 1 ? 'person' : 'people'} online
            </p>
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            Leave
          </button>
        </div>
        
        {/* Online Users */}
        {userList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {userList.map((user, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 rounded-full text-xs ${
                  user === username 
                    ? 'bg-white text-black' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {user} {user === username && '(You)'}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.name === username;
            
            const currentTimestamp = msg.timestamp || new Date().toISOString();
            const prevTimestamp = idx > 0 ? (messages[idx - 1].timestamp || new Date().toISOString()) : null;
            const showDate = idx === 0 || 
              (prevTimestamp && formatDate(currentTimestamp) !== formatDate(prevTimestamp));
            
            return (
              <div key={idx}>
                {/* Date Separator */}
                {showDate && (
                  <div className="text-center text-xs text-gray-500 my-4">
                    {formatDate(currentTimestamp)}
                  </div>
                )}
                
                {/* Message */}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isOwn 
                      ? 'bg-white text-black rounded-br-md' 
                      : 'bg-[#1A1A1A] text-white rounded-bl-md border border-gray-800'
                  }`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-400 mb-1 font-medium">
                        {msg.name}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed break-words">
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {formatTime(currentTimestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#1A1A1A] border-t border-gray-800 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none transition-all duration-200"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                height: 'auto'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}