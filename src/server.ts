import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import http from "http";

import userRoutes from "./routes/User";
import chatRoutes from "./routes/Chat";
import messageRoutes from "./routes/Message";

import { errorHandler, notFound } from "./middlewares/error";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send({
    message: "Server is up and running",
  });
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

// Sockets implementation
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Join User to the room (group chat Id)
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat users are not defined");

    chat.users.forEach((user: any) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

export default server;
