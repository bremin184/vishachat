const { randomUUID } = require('crypto');
const { PresenceManager, STATUS } = require('../../pages/presence');
const { connectedUsers, waitingQueue } = require('../../pages/store');

module.exports = (io) => {
  const presence = new PresenceManager(io);

  const findMatch = () => {
    if (waitingQueue.size < 2) return;

    const queueArray = Array.from(waitingQueue);
    const user1Id = queueArray[0];
    const user1 = connectedUsers.get(user1Id);

    // Find a compatible match (not the same user session)
    let user2Id = null;

    for (let i = 1; i < queueArray.length; i++) {
      const potentialId = queueArray[i];
      const potentialUser = connectedUsers.get(potentialId);
      
      // Prevent self-matching (same session ID)
      if (potentialUser && potentialUser.sessionId !== user1.sessionId) {
        user2Id = potentialId;
        break;
      }
    }

    if (user2Id) {
      const user2 = connectedUsers.get(user2Id);
      
      // Remove both from queue
      waitingQueue.delete(user1Id);
      waitingQueue.delete(user2Id);

      // Create Room
      const roomId = randomUUID();
      
      const socket1 = io.sockets.sockets.get(user1Id);
      const socket2 = io.sockets.sockets.get(user2Id);

      if (socket1 && socket2) {
        socket1.join(roomId);
        socket2.join(roomId);

        presence.updateUserStatus(socket1, STATUS.IN_CALL, { roomId });
        presence.updateUserStatus(socket2, STATUS.IN_CALL, { roomId });

        // Emit match found with a slight delay to ensure client state is ready
        // This helps prevent the "offer before listener" race condition
        setTimeout(() => {
          io.to(user1Id).emit('matchFound', { 
            roomId, 
            peerInfo: { socketId: user2.socketId, deviceInfo: user2.deviceInfo },
            isInitiator: true 
          });
          io.to(user2Id).emit('matchFound', { 
            roomId, 
            peerInfo: { socketId: user1.socketId, deviceInfo: user1.deviceInfo },
            isInitiator: false 
          });
        }, 100);
        
        console.log(`Match found: ${roomId}`);
      } else {
        // Handle edge case where socket disconnected during match
        if (socket1) waitingQueue.add(user1Id);
        if (socket2) waitingQueue.add(user2Id);
        
        // Retry matching for the survivor immediately
        if (waitingQueue.size >= 2) findMatch();
      }
    }
  };

  io.on('connection', (socket) => {
    // Extract auth data sent from frontend
    const { sessionId, deviceInfo } = socket.handshake.auth;

    if (!sessionId) {
      console.log(`[${socket.id}] Connection rejected: No session ID provided.`);
      return socket.disconnect();
    }

    // Create user entry
    const user = {
      socketId: socket.id,
      sessionId,
      deviceInfo: deviceInfo || 'Unknown Device',
      status: STATUS.ONLINE,
      roomId: null,
      connectedAt: new Date()
    };

    connectedUsers.set(socket.id, user);

    console.log(`User connected: ${sessionId}`);
    console.log(`Device: ${user.deviceInfo}`);
    console.log(`Total connected users: ${connectedUsers.size}`);

    // Broadcast updated count to all clients
    io.emit('onlineUsersCount', connectedUsers.size);

    // Let other clients know about the new user's status
    socket.broadcast.emit('userStatusUpdate', { socketId: socket.id, status: user.status });

    socket.on('getInitialPresence', () => {
      presence.sendInitialPresence(socket);
    });

    // Matchmaking Events
    socket.on('joinCall', () => {
      presence.updateUserStatus(socket, STATUS.SEARCHING);
      waitingQueue.add(socket.id);
      findMatch();
    });

    socket.on('leaveQueue', () => {
      waitingQueue.delete(socket.id);
      presence.updateUserStatus(socket, STATUS.ONLINE);
    });

    socket.on('endCall', ({ roomId }) => {
      const roomSockets = io.sockets.adapter.rooms.get(roomId);
      if (roomSockets) {
        io.to(roomId).emit('callEnded');
        roomSockets.forEach(socketId => {
          const peerSocket = io.sockets.sockets.get(socketId);
          if (peerSocket) {
            presence.updateUserStatus(peerSocket, STATUS.ONLINE);
            peerSocket.leave(roomId);
          }
        });
      }
    });

    // WebRTC Signaling
    socket.on('offer', ({ roomId, sdp }) => {
      socket.to(roomId).emit('receiveOffer', { sdp, senderId: socket.id });
    });

    socket.on('answer', ({ roomId, sdp }) => {
      socket.to(roomId).emit('receiveAnswer', { sdp, senderId: socket.id });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('iceCandidate', { candidate, senderId: socket.id });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      waitingQueue.delete(socket.id);
      presence.handleDisconnect(socket);
      console.log(`User disconnected: ${sessionId}`);
      console.log(`Total connected users: ${connectedUsers.size}`);

      // Broadcast updated count to all clients
      io.emit('onlineUsersCount', connectedUsers.size);
    });
  });
};