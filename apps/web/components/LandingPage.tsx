"use client";
import { useState } from "react";

interface LandingPageProps {
  onJoinRoom: (username: string, roomId: string) => void;
}

export default function LandingPage({ onJoinRoom }: LandingPageProps) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    
    if (!roomId.trim()) {
      alert("Please enter a room ID or generate one");
      return;
    }

    setIsJoining(true);
    onJoinRoom(username.trim(), roomId.trim().toUpperCase());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Chat Room
            </h1>
            <p className="text-gray-400 text-sm">
              Connect with others in real-time
            </p>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              maxLength={20}
            />
          </div>

          {/* Room ID Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter room ID"
                className="flex-1 px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                maxLength={10}
              />
              <button
                onClick={generateRoomId}
                className="px-4 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium whitespace-nowrap"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinRoom}
            disabled={isJoining}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </button>

          {/* Instructions */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Share the room ID with others to chat together</p>
          </div>
        </div>
      </div>
    </div>
  );
}