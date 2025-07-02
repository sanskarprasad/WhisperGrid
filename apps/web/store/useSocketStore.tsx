// store/useSocketStore.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  messages: string[];
  sendMessage: (msg: string) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  messages: [],

  connectSocket: () => {
    const socket = io("http://localhost:8000");

    socket.on("message", (msg: string) => {
      const { message } = JSON.parse(msg);
      set((state) => ({
        messages: [...state.messages, message],
      }));
      console.log("From Server Msg Rec", message);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  sendMessage: (msg: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("event:message", { message: msg });
      console.log("Send Message", msg);
    }
  },
}));
