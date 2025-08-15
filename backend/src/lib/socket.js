// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Allow CORS from frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Store online users
const userSocketMap = {}; // { userId: socketId }
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Send updated online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for sending messages
  socket.on("sendMessage", (message) => {
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message); // send to receiver
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };