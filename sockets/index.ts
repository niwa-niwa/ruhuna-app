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

const PATH_CHAT = "/chatSockets";

const io: Server = new Server({
  path: PATH_CHAT,
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

  console.log("verify a user", currentUser.id);
  next();
});

io.on("connection", (socket: CustomSocket) => {
  // join the room
  socket.on("subscribe", async (data) => {
    if(socket.currentUser === undefined)return

    socket.join(data.villageId);
    console.log("join to room = ", data.villageId);

    // TODO confirm the user can join the village with DB
    const village = await prismaClient.village.findFirst({
      where:{
        id:data.villageId,
        users:{
          some:{
            id:{
              in:[socket.currentUser.id]
            }
          }
        }
      }
    })

    if(!village){
      // TODO implement response emit error
      io.to(socket.id).emit("subscribe",{
        errorObj: generateErrorObj(404, "The Village is not found") 
      })
    }else{
      // TODO implement response emit success
      io.to(socket.id).emit("subscribe",{village})
    }


  });

  // TODO send a message
  socket.on("send_message", (data) => {
    console.log(data);
    io.sockets.in(data.villageId).emit("messages", {
      user: socket.currentUser,
      villageId: data.villageId,
      message: data.message,
    });
  });

  // TODO leave the room
  socket.on("unsubscribe", (data) => {
    socket.leave(data.room);
    console.log("leave room = ", data.villageId);
  });
});

export { io, PATH_CHAT };
