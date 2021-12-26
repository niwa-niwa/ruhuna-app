import { User, Village } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../lib/firebaseAdmin";
import { ErrorObj } from "../api/types/ErrorObj";
import { generateErrorObj } from "../lib/generateErrorObj";

export type CustomSocket = Socket & {
  currentUser?: User;
};

const PATH_CHAT_SOCKET = "/chatSockets";

const EV_CHAT_SOCKET = {
  SUBSCRIBE: "subscribe_village",
};

const io: Server = new Server({
  path: PATH_CHAT_SOCKET,
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

io.on("connection", (socket: CustomSocket) => {
  // subscribe a village
  socket.on(EV_CHAT_SOCKET.SUBSCRIBE, async (data) => {
    // the error is impossible but it must implemented for typescript
    if (socket.currentUser === undefined) {
      const err: any = new Error();
      err.data = { errorObj: generateErrorObj(414, "the user is not found") };
      socket.emit("connect_error", { ...err });
      return;
    }

    // confirm the user can join the village with DB
    const village: (Village & { users: User[] }) | null =
      await prismaClient.village.findFirst({
        where: {
          id: data.villageId,
        },
        include: { users: true },
      });

    if (!village) {
      // village is null then response emit error
      io.to(socket.id).emit(EV_CHAT_SOCKET.SUBSCRIBE, {
        errorObj: generateErrorObj(404, "The Village is not found"),
      });
      return;
    }

    // is exist currentUser in the village
    const isExist = village.users.find(
      (user: User) => user.id === socket.currentUser?.id
    );

    if (!village.isPublic && !isExist) {
      // village is private and currentUser is not invited
      io.to(socket.id).emit(EV_CHAT_SOCKET.SUBSCRIBE, {
        errorObj: generateErrorObj(404, "The Village is not found"),
      });
      return;
    }

    if (village.isPublic && !isExist) {
      // if the village is public
      await prismaClient.village.update({
        where: { id: village.id },
        data: { users: { connect: { id: socket.currentUser.id } } },
      });
    }

    socket.join(data.villageId);

    // currentUser can be join, response emit success
    io.to(socket.id).emit(EV_CHAT_SOCKET.SUBSCRIBE, { village });
  });

  // TODO the function that leave the room implement messageController
  socket.on("unsubscribe", (data) => {
    socket.leave(data.room);
    console.log("leave room = ", data.villageId);
  });
});

export { io, PATH_CHAT_SOCKET, EV_CHAT_SOCKET };
