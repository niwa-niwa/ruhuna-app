import express, { Router } from "express";
import { PATH } from "../../consts/url";
import { v1 } from "./v1";

const router: Router = Router();

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

router.use(PATH.V1, v1);

export { router };
