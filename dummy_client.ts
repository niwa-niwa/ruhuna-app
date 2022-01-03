import { io } from "socket.io-client";

const port = process.env.PORT || 3000;

const socket = io(`http://localhost:${port}`, { path: "/sockets" });

socket.on("connect", () => console.log("connect"));
