require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./db/database");
const app = require("./app");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);
  socket.on("task-updated", (data) => {
    io.emit("task-updated", data);
  });
});

server.listen(5000, () =>
  console.log("Server running on port http://localhost:5000")
);
