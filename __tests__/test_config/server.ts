import "dotenv/config";
import express from "express";
import { apiRouter } from "../../api/routers";

const server = express();

server.use("/api", apiRouter);

export default server;
