// store/useSocketStore.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface Message {
  name: string;
  message: string;
  timestamp?: string; // Make timestamp optional for backward compatibility
}

interface SocketState {
  socket: Socket | null;
  messages: Message[];
  userCount: number;
  userList: string[];
  isConnected: boolean;
  connectSocket: (username: string, roomId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (msg: string, roomId: string, username: string) => void;
  clearMessages: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  messages: [],
  userCount: 0,
  userList: [],
  isConnected: false,

  connectSocket: (username: string, roomId: string) => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("🟢 Connected to server");
      socket.emit("join-room", { roomId, username });
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from server");
      set({ isConnected: false });
    });

    // Room joined successfully
    socket.on("room-joined", ({ roomId, userCount, userList }) => {
      console.log(`✅ Joined room ${roomId} with ${userCount} users`);
      set({ userCount, userList });
    });

    // User joined notification
    socket.on("user-joined", ({ username, userCount, userList }) => {
      console.log(`👤 ${username} joined the room`);
      set({ userCount, userList });
    });

    // User left notification
    socket.on("user-left", ({ username, userCount, userList }) => {
      console.log(`👋 ${username} left the room`);
      set({ userCount, userList });
    });

    // Message received
    socket.on("message", (msg: string) => {
      try {
        const messageData: Message = JSON.parse(msg);
        set((state) => ({
          messages: [...state.messages, messageData],
        }));
        console.log("📨 Message received:", messageData);
      } catch (err) {
        console.error("❌ Message parse failed:", err);
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null, 
        isConnected: false,
        userCount: 0,
        userList: []
      });
    }
  },

  sendMessage: (msg: string, roomId: string, username: string) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit("event:message", { 
        message: msg, 
        roomId, 
        username 
      });
      console.log("📤 Message sent:", msg);
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));