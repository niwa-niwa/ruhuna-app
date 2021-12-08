require("dotenv").config();

import next from "next";
import express, { Request, Response } from "express";
import { api } from "./api";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

async function main() {
  try {
    await app.prepare();

    const server = express();

    server.use(api);

    server.all("*", (req: Request, res: Response) => {
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
