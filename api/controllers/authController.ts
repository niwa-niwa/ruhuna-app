import { Response } from "express";
import { CustomRequest } from "../types/CustomRequest";

export const auth = async (req: CustomRequest, res: Response) => {
  res.status(200).json({ currentUser: req.currentUser });
};

const authController = { auth };

export default authController;
