import { Server } from 'socket.io';
import { Io } from './socket-types';
import surveyHandler from './surveyHandler';
let io: Io;

export default function socketsManager(server) {
    io = new Server(server, {
        cors: {
          origin: "http://localhost:4200",
          methods: ["GET", "POST"]
        }
      });

    io.on('connection', (socket) => {
        surveyHandler(io, socket);
    });
}