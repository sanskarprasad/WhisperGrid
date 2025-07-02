"use client"; // 👈 IMPORTANT
import { useEffect } from "react";
import { useSocketStore } from "../store/useSocketStore";

export default function SocketInit() {
  const connectSocket = useSocketStore((s) => s.connectSocket);
  const disconnectSocket = useSocketStore((s) => s.disconnectSocket);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  return null;
}
