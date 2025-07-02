import { Server } from "socket.io";

class SocketService {
  private _io: Server;
  private connectedClients = 0; // 🧮 Counter for connected sockets

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
            cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      this.connectedClients++; // 🔼 Increment when new socket connects
      console.log(`✅ New Socket Connected: ${socket.id}`);
      console.log(`🔢 Total Connected Clients: ${this.connectedClients}`);

      // Listen to custom event
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("💬 New Message Rec.", message);
      });

      // Listen to disconnect event
      socket.on("disconnect", () => {
        this.connectedClients--; // 🔽 Decrement when socket disconnects
        console.log(`❌ Socket Disconnected: ${socket.id}`);
        console.log(`🔢 Total Connected Clients: ${this.connectedClients}`);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
