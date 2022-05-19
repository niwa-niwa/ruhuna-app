require("dotenv").config();

import http from "http";
import next from "next";
import express, { Express, Request, Response } from "express";
import { api } from "./rest";
import { ioChatSocket } from "./sockets/chatSocket";
import { NextServer, RequestHandler } from "next/dist/server/next";
// import { apolloServer } from "./graphql/app";

const dev: boolean = process.env.NODE_ENV !== "production";
const port: string = process.env.PORT || "3000";
const frontApp: NextServer = next({ dev });
const handle: RequestHandler = frontApp.getRequestHandler();
const app: Express = express();
const server: http.Server = http.createServer(app);

async function main() {
  try {
    // ready frontend
    await frontApp.prepare();

    // ready graphql
    // await apolloServer.start();

    // insert graphql to express
    // apolloServer.applyMiddleware({ app, path: "/graphql" });

    // insert web socket to http server
    ioChatSocket.attach(server);

    // insert REST API to express
    app.use(api);

    // insert frontend to express
    app.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    // start express server
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
