const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("chat message", ({ room, username, message }) => {
    // Broadcast to everyone in the room except sender
    socket.to(room).emit("chat message", { username, message });
    // Optionally, send back to sender too if you want
    // socket.emit("chat message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});


server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
