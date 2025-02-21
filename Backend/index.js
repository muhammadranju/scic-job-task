require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./db/database");
const app = require("./app");
const updatedTasksStatus = require("./utils/updateStatus.socket");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  updatedTasksStatus(socket, io);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () =>
  console.log("WebSocket Server running on http://your-backend.com:5000")
);
