require("dotenv").config();

import http from "http";
import next from "next";
import express, { Express, Request, Response } from "express";
import { api } from "./api";
import { io } from "./sockets";
import { NextServer, RequestHandler } from "next/dist/server/next";
import helmet from "helmet"

const dev: boolean = process.env.NODE_ENV !== "production";
const port: string = process.env.PORT || "3000";
const frontApp: NextServer = next({ dev });
const handle: RequestHandler = frontApp.getRequestHandler();
const app: Express = express();
const server: http.Server = http.createServer(app);

async function main() {
  try {
    await frontApp.prepare();

    io.attach(server);

    app.use(helmet())
    app.use(api);

    app.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(
        `> Start on http://localhost:${port} - env ${process.env.NODE_ENV}`
      );
    });
  } catch (e: any) {
    console.error(e);

    process.exit(1);
  }
}

main();
