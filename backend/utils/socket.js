import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io instance has not been initialized');
  }
  return io;
};
