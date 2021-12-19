require("dotenv").config();

import next from "next";
import express, { Request, Response } from "express";
import { api } from "./api";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const frontApp = next({ dev });
const handle = frontApp.getRequestHandler();

import http from "http";
import { Server } from "socket.io";

async function main() {
  try {
    await frontApp.prepare();

    const app = express();
    const server = http.createServer(app);

    app.use(api);

    const io = new Server(server);

    io.on("connection", (socket) => {
      console.log("a user connected");
    });

    app.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(
        `> Start on http://localhost:${port} - env ${process.env.NODE_ENV}`
      );
    });
  } catch (e) {
    console.error(e);

    process.exit(1);
  }
}

main();
