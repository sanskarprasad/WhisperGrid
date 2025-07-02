# ⚡ Scalable Chat App

A highly scalable, real-time chat application built with a modern microservice architecture. Designed for performance, autoscaling, and real-time communication using WebSockets, Redis, Kafka, and PostgreSQL.

---

## 📐 Architecture Overview

![image](https://github.com/user-attachments/assets/513149a3-74da-4af3-b4b7-e804c7ace78c)


- **WebSocket Servers**: Horizontally scalable servers handling real-time messaging between clients.
- **Redis Pub/Sub**: Bridges communication between WebSocket servers to handle autoscaling problems and broadcast messages across all nodes.
- **Kafka**: Used for message durability, logging, and decoupling services in the system.
- **PostgreSQL**: Stores user data, chat histories, and other relational data — hosted on **Aiven**.
- **Turbo Repo**: Codebase managed using [Turborepo](https://turbo.build/repo) for mono-repo development across apps and packages.
- **Next.js**: Frontend app with SSR, API routes, and authentication.

---

## ⚙️ Tech Stack

| Layer            | Tech Stack                          |
|------------------|-------------------------------------|
| Frontend         | Next.js, TailwindCSS, WebSocket     |
| Backend          | Node.js (WebSocket), Redis Pub/Sub  |
| Messaging Queue  | Apache Kafka                        |
| Database         | PostgreSQL (Aiven)                  |
| State Sharing    | Redis                               |
| Monorepo         | TurboRepo                           |

---

## 🚀 Features

- ⚡ **Real-time Messaging** with WebSocket
- 🔄 **Horizontal Scaling** of WebSocket servers
- 🧠 **Redis Pub/Sub** to sync messages between servers
- 🧵 **Kafka** for decoupled, durable event-driven architecture
- 💾 **Persistent Chat History** stored in PostgreSQL
- 🌐 **Modern UI** with Next.js & Tailwind
- 📦 **Monorepo** setup for scalable development

---

## 🧠 Problem Solved

When using multiple WebSocket servers behind a load balancer (autoscaling), a message sent to user `u1` connected to `server1` won't reach `u4` on `server2` unless there’s a **shared message bus**.

> **Redis Pub/Sub** solves this problem by allowing all servers to publish/subscribe to the same channel, ensuring real-time messages are synced across all nodes.

---

## 📁 Monorepo Structure (Turborepo)

```bash
.
├── apps/
│   ├── client         # Next.js frontend
│   └── websocket-server # Node.js + WebSocket server
├── packages/
│   └── ui             # Shared UI components
├── .gitignore
├── package.json
└── turbo.json
```


## ⭐ Future Roadmap
- ✅ Auth with JWT & OAuth
- ✅ Redis Pub/Sub sync
- ⏳ Admin Dashboard
- ⏳ Group Chats, Typing Indicator
- ⏳ Notifications system (Kafka-based)

