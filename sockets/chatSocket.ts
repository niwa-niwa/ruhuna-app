import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { User, Village } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";
import { verifyToken } from "../lib/firebaseAdmin";
import { ErrorObj } from "../api/types/ErrorObj";
import { generateErrorObj } from "../lib/generateErrorObj";

/**
 * Custom socket object for io socket
 */
export type CustomSocket = Socket & { currentUser?: User };

/**
 * Custom error object for io socket
 */
export type CustomError = Error & { data?: object };

// path for connecting chat socket
const PATH_CHAT_SOCKET: string = "/chatSocket";

// EVs for chat socket
const EV_CHAT_SOCKET: {
  SUBSCRIBE: string;
  CONNECTION: string;
  CONNECT_ERROR: string;
  MESSAGE: string;
} = {
  SUBSCRIBE: "subscribe_village",
  CONNECTION: "connection",
  CONNECT_ERROR: "connect_error",
  MESSAGE:"message",
};

// an instance for socket server
const ioChatSocket: Server = new Server({
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
ioChatSocket.use(
  async (
    socket: CustomSocket,
    next: (err?: ExtendedError | undefined) => void
  ) => {
    // verify firebase token

    // get token data from request query
    const token_data: string | string[] | undefined =
      socket.handshake.query.token;

    // throw an error if token undefined
    if (token_data === undefined) {
      const err: CustomError = new Error();
      err.data = { errorObj: generateErrorObj(400, "token is nothing") };
      next(err);
      return;
    }

    // get token
    const token: string = Array.isArray(token_data)
      ? token_data[0]
      : token_data;

    // verify token with firebase api
    const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(token);

    // throw an error if firebaseUser is errorObj
    if ("errorCode" in firebaseUser) {
      const err: CustomError = new Error();
      err.data = {
        errorObj: generateErrorObj(
          404,
          "token is expired or firebase user is not found"
        ),
      };
      next(err);
      return;
    }

    // get a model current user
    const currentUser: User | null = await prismaClient.user.findUnique({
      where: { firebaseId: firebaseUser.uid },
    });

    // throw an error if currentUser is null
    if (!currentUser) {
      const err: CustomError = new Error();
      err.data = { errorObj: generateErrorObj(404, "the user is not found") };
      next(err);
      return;
    }

    // insert currentUser to socket
    socket.currentUser = currentUser;

    next();
  }
);

// chat Socket connection
ioChatSocket.on(EV_CHAT_SOCKET.CONNECTION, (socket: CustomSocket) => {
  // subscribe a village
  socket.on(EV_CHAT_SOCKET.SUBSCRIBE, async (data: any) => {
    // throw an error if socket doesn't have currentUser
    if (socket.currentUser === undefined) {
      const err: CustomError = new Error();
      err.data = { errorObj: generateErrorObj(414, "the user is not found") };
      socket.emit(EV_CHAT_SOCKET.CONNECT_ERROR, { ...err });
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

    // Throw an error if village is null
    if (!village) {
      // village is null then response emit error
      ioChatSocket.to(socket.id).emit(EV_CHAT_SOCKET.SUBSCRIBE, {
        errorObj: generateErrorObj(
          404,
          `The Village is not found : ${data.villageId}`
        ),
      });
      return;
    }

    // confirm if exist is currentUser in the village
    const isMember: User | undefined = village.users.find(
      (user: User) => user.id === socket.currentUser?.id
    );

    // Throw an error if currentUser can not join
    if (!village.isPublic && !isMember) {
      // village is private and currentUser is not invited
      ioChatSocket.to(socket.id).emit(EV_CHAT_SOCKET.SUBSCRIBE, {
        errorObj: generateErrorObj(
          404,
          `The Village is not found : ${data.villageId}`
        ),
      });
      return;
    }

    // insert data that currentUser join the village to db
    if (village.isPublic && !isMember) {
      // if the village is public
      await prismaClient.village.update({
        where: { id: village.id },
        data: { users: { connect: { id: socket.currentUser.id } } },
      });
    }

    // join the village
    socket.join(data.villageId);

    // currentUser can be join, response emit success
    ioChatSocket.to(socket.id).emit(EV_CHAT_SOCKET.SUBSCRIBE, { village });
  });
});

export { ioChatSocket, PATH_CHAT_SOCKET, EV_CHAT_SOCKET };