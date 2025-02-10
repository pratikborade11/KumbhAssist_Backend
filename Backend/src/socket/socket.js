import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

const userSocketMap = {}; // {userId : socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("User connected 👤:", socket.id);

    const userId = socket.handshake.query.userId; // Sent from client

    if (userId) {
        userSocketMap[userId] = socket.id;        
    }

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
    });
});

export { app, httpServer, io, userSocketMap };
