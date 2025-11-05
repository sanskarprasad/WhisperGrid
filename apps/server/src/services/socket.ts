import { Server } from "socket.io";
import Redis from "ioredis";

// Get the Redis URL from the environment variable
const redisUrl = process.env.REDIS_URL || "redis://redis:6379";

// Redis Publisher
const pub = new Redis(redisUrl);

// Redis Subscriber
const sub = new Redis(redisUrl);

class SocketService {
  private _io: Server;
  private roomUsers = new Map<string, Map<string, string>>(); // roomId -> socketId -> username

  constructor() {
    console.log("✅ Init Socket Service...");

    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });

    this.initRedisListeners();
  }

  private initRedisListeners() {
    sub.subscribe("chat", (err, count) => {
      if (err) {
        console.error("❌ Redis subscribe error:", err);
      } else {
        console.log(`📡 Subscribed to ${count} Redis channel(s)`);
      }
    });

    sub.on("message", (channel, message) => {
      console.log(`📨 Redis -> Channel: ${channel} | Message: ${message}`);
      const data = JSON.parse(message);
      this.io.to(data.roomId).emit("message", message);
    });
  }

  public initListeners() {
    const io = this.io;
    console.log("🧲 Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`🟢 New Socket Connected: ${socket.id}`);

      // Join room with username
      socket.on("join-room", ({ roomId, username }: { roomId: string; username: string }) => {
        socket.join(roomId);
        
        // Store user in room
        if (!this.roomUsers.has(roomId)) {
          this.roomUsers.set(roomId, new Map());
        }
        this.roomUsers.get(roomId)!.set(socket.id, username);

        // Get room user count and list
        const roomUserMap = this.roomUsers.get(roomId)!;
        const userCount = roomUserMap.size;
        const userList = Array.from(roomUserMap.values());

        // Notify room about new user
        socket.to(roomId).emit("user-joined", { username, userCount, userList });
        socket.emit("room-joined", { roomId, userCount, userList });

        console.log(`👤 ${username} joined room ${roomId}. Total users: ${userCount}`);
      });

      // Handle messages
      socket.on("event:message", async ({ message, roomId, username }: { message: string; roomId: string; username: string }) => {
        console.log(`💬 Message from ${username} in room ${roomId}:`, message);

        const messageData = {
          name: username,
          message,
          roomId,
          timestamp: new Date().toISOString()
        };

        // Publish message to Redis
        await pub.publish("chat", JSON.stringify(messageData));
      });

      socket.on("disconnect", () => {
        // Remove user from all rooms
        for (const [roomId, userMap] of this.roomUsers.entries()) {
          if (userMap.has(socket.id)) {
            const username = userMap.get(socket.id)!;
            userMap.delete(socket.id);
            
            const userCount = userMap.size;
            const userList = Array.from(userMap.values());

            // Clean up empty rooms
            if (userCount === 0) {
              this.roomUsers.delete(roomId);
            } else {
              // Notify room about user leaving
              socket.to(roomId).emit("user-left", { username, userCount, userList });
            }

            console.log(`🔴 ${username} left room ${roomId}. Remaining users: ${userCount}`);
            break;
          }
        }
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;