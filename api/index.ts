import express, { Express } from "express";
import { router } from "./routers/router";

const api: Express = express();

api.use("/api", router);

export { api };
