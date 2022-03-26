import express, { Express } from "express";
import { router } from "./routers/router";
import { PATH } from "../consts/url";

const api: Express = express();

api.use(PATH.REST, router);

export { api };
