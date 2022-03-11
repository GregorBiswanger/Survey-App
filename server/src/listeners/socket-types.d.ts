import * as socketIo from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type Io = socketIo.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type Socket = socketIo.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;