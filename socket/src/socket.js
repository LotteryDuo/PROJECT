import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let winningNumbers = [12, 23, 34, 45, 56]; // Dummy winning numbers

// API Endpoint for Winning Numbers
app.get("/winning-numbers", (req, res) => {
  res.json({ numbers: winningNumbers });
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("bet", (data) => {
    console.log("Bet received:", data);
    io.emit("bet", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on http://localhost:4000");
});
