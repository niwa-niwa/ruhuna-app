import { Response } from "express";
import { CustomRequest } from "../types/CustomRequest";

function auth(req: CustomRequest, res: Response): void {
  res.status(200).json({ currentUser: req.currentUser });
}

const authController: { auth: any } = { auth };

export default authController;
