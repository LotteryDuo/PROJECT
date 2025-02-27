import { createServer } from "http";

import { Server as SocketIo } from "socket.io";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config.js";

import createV1Router from "./routes/v1/index.js";

import "./core/database.js";
import morgan from "morgan";

const app = express(); // first layer server
const port = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = createServer(app);

const io = new SocketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    query: { tabId: Math.random().toString(36).substring(7) },
    credentials: true, // ✅ Allow credentials (cookies, auth)
    apikey: "hello",
  },
});

app.use("/v1", cors(), createV1Router(io));

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Listen for "userConnected" and update global user list
  socket.on("userConnected", (userData) => {
    const existingUser = onlineUsers.find(
      (user) => user.username === userData.username
    );

    if (existingUser) {
      console.log(`${userData.username} is already logged in.`);

      // ✅ Force logout from all tabs
      io.to(existingUser.socketId).emit("forceLogout");

      onlineUsers = onlineUsers.filter(
        (user) => user.username !== userData.username
      );
    }

    onlineUsers.push({ ...userData, socketId: socket.id });
    io.emit("updateOnlineUsers", onlineUsers);
  });

  // ✅ Handle manual logout or tab close
  socket.on("userDisconnected", (userData) => {
    onlineUsers = onlineUsers.filter(
      (user) => user.username !== userData.username
    );
    console.log(`${userData.username} manually disconnected.`);
    io.emit("updateOnlineUsers", onlineUsers);
  });

  // ✅ Handle automatic socket disconnect
  socket.on("disconnect", () => {
    const disconnectedUser = onlineUsers.find(
      (user) => user.socketId === socket.id
    );
    if (disconnectedUser) {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log(`${disconnectedUser.username} has disconnected.`);
      io.emit("updateOnlineUsers", onlineUsers);
    }
  });
});

server.listen(port, () => {
  console.log(`App and running at port ${port}...`);
});
