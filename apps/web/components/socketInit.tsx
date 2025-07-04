// "use client"; // 👈 IMPORTANT
// import { useEffect } from "react";
// import { useSocketStore } from "../store/useSocketStore";

// export default function SocketInit() {
//   const connectSocket = useSocketStore((s) => s.connectSocket);
//   const disconnectSocket = useSocketStore((s) => s.disconnectSocket);

//   useEffect(() => {
// const name = localStorage.getItem("username") || "Guest";
// connectSocket(name);

//     return () => disconnectSocket();
//   }, [connectSocket, disconnectSocket]);

//   return null;
// }
