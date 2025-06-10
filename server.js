const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join room", (room) => {
    for (const r of socket.rooms) {
    if (r !== socket.id) {
      socket.leave(r);
      console.log(`Socket ${socket.id} left room ${r}`);
    }
  }
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("chat message", ({ room, username, message }) => {
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(room).emit("chat message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
