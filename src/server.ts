import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

import userRoutes from "./routes/User";
import chatRoutes from "./routes/Chat";

import { connectDB } from "./config/db";
import { errorHandler, notFound } from "./middlewares/error";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Api running successfully!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
});
