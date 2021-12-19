import { Server, Socket } from "socket.io";

const io: Server = new Server({
  path: "/sockets",
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

io.use((socket: Socket, next) => {
  console.log("message from middleware");
  next();
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected third");
});

export { io };
