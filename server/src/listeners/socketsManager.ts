import { Server } from 'socket.io';
import { Io } from './socket-types';
import surveyHandler from './surveyHandler';
let io: Io;

export default function socketsManager(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        surveyHandler(io, socket);
    });
}