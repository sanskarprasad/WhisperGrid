"use client";
import { useState } from "react";
import { useSocketStore } from "../store/useSocketStore";
// import LandingPage from "../components/LandingPage";
// import {} from LandingPage
import ChatInterface from "../components/ChatInterface";
import LandingPage from "../components/LandingPage";

export default function Page() {
  const { connectSocket, disconnectSocket, clearMessages } = useSocketStore();
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [userSession, setUserSession] = useState<{
    username: string;
    roomId: string;
  } | null>(null);

  const handleJoinRoom = (username: string, roomId: string) => {
    // Clear previous messages
    clearMessages();
    
    // Connect to socket with room
    connectSocket(username, roomId);
    
    // Update session and view
    setUserSession({ username, roomId });
    setCurrentView('chat');
  };

  const handleLeaveRoom = () => {
    // Disconnect socket
    disconnectSocket();
    
    // Clear session and return to landing
    setUserSession(null);
    setCurrentView('landing');
    clearMessages();
  };

  if (currentView === 'landing') {
    return <LandingPage onJoinRoom={handleJoinRoom} />;
  }

  if (currentView === 'chat' && userSession) {
    return (
      <ChatInterface
        username={userSession.username}
        roomId={userSession.roomId}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return null;
}