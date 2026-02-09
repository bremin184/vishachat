const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Adjust to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Initialize Socket Logic
socketHandler(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});