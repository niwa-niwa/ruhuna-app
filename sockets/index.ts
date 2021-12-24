import { User } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../lib/firebaseAdmin";
import { ErrorObj } from "../api/types/ErrorObj";
import { generateErrorObj } from "../lib/generateErrorObj";

type CustomSocket = Socket & {
  currentUser?: User;
};

// TODO create const file to implement paths
const io: Server = new Server({
  path: "/chatSockets",
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

/**
 * Middleware for authentication
 */
io.use(async (socket: CustomSocket, next) => {
  // verify firebase token

  const token_data: string | string[] | undefined =
    socket.handshake.query.token;

  if (token_data === undefined) {
    const err: any = new Error();
    err.data = { errorObj: generateErrorObj(400, "token is nothing") };
    next(err);
    return;
  }

  const token = Array.isArray(token_data) ? token_data[0] : token_data;

  const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(token);

  if ("errorCode" in firebaseUser) {
    const err: any = new Error();
    err.data = {
      errorObj: generateErrorObj(
        404,
        "token is expired or firebase user is not found"
      ),
    };
    next(err);
    return;
  }

  const currentUser: User | null = await prismaClient.user.findUnique({
    where: { firebaseId: firebaseUser.uid },
  });

  if (!currentUser) {
    const err: any = new Error();
    err.data = { errorObj: generateErrorObj(404, "the user is not found") };
    next(err);
    return;
  }

  socket.currentUser = currentUser;

  next();
});

io.on("connection", async (socket: CustomSocket) => {
  // TODO create an type of the variable for member of a room {socketId, firebaseToken}
  let currentMembers: object;

  // TODO join the room
  socket.on("join", (data) => {
    // TODO notify users who are login
    // TODO send status of whether the user can join at the room
    io.emit("result_join", { room: data.room, status: true });
  });

  // TODO send a message

  // TODO leave the room
});

export { io };
