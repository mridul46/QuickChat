import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.routes.js";
import healthCheckRouter from "./src/routes/healthCheck.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "https://quick-chat-bay-six.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors({
  origin: [
    "https://quick-chat-bay-six.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
}));

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/status", (req, res) => res.send("Server is live"));
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/messages", messageRouter);

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port: ${PORT}`));
