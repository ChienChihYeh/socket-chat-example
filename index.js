import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.broadcast.emit("chat message", "hi");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  //   You can send any number of arguments, and all serializable data structures are supported
  //   including binary objects like ArrayBuffer, TypedArray or Buffer (Node.js only):
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  // to join the room named 'some room'
  //   socket.join("some room");

  // broadcast to all connected clients in the room
  //   io.to('some room').emit('hello', 'world');

  // broadcast to all other connected clients in the room
  //   socket.broadcast.to('some-room').emit('chat message', 'hello')

  // broadcast to all connected clients except those in the room
  // io.except('some room').emit('hello', 'world');

  // leave the room
  // socket.leave('some room');
});
