import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

import { connectDB } from "./config/db";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Api running successfully!");
});

const server = app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
});
