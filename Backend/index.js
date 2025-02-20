require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./db/database");
const app = require("./app");
const updatedTasksStatus = require("./utils/updateStatus.socket");

connectDB();

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);
//   updatedTasksStatus(socket, io);
// });

server.listen(5000, () =>
  console.log("Server running on port http://localhost:5000")
);
