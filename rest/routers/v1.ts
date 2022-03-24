import express, { Response, Request, Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
import villageController from "../controllers/villageController";
import messageController from "../controllers/messageController";

const v1: Router = Router();

v1.use(
  "/health",
  Router().get("/", (req: Request, res: Response) => {
    res.status(200).json("It Works!!");
  })
);

v1.use("/auth", validateToken, Router().get("/", authController.auth));

// TODO /users validate all request and delete namespace
v1.use(
  "/users",
  express
    .Router()
    .get("/", validateToken, userController.getUsers)
    .get("/:userId", validateToken, userController.getUserDetail)
    .get("/:userId/messages", validateToken, userController.getUserMessages)
    // .get("/:userId/messages/:messageId", validateToken, userController.getUserDetail)
    // .get("/:userId/villages", validateToken, userController.getUserDetail)
    // .get("/:userId/villages/:villageId", validateToken, userController.getUserDetail)
    .post("/create", validateToken, userController.createUser)
    .patch("/:userId", validateToken, userController.editUser)
    .delete("/delete/:userId", validateToken, userController.deleteUser)
);

v1.use(
  "/villages",
  validateToken,
  express
    .Router()
    .get("/", villageController.getVillages)
    .get("/:villageId", villageController.getVillageDetail)
    .post("/create", villageController.createVillage)
    .put("/edit/:villageId", villageController.editVillage)
    .put("/leave/:villageId", villageController.leaveVillage)
    .delete("/delete/:villageId", villageController.deleteVillage)
);

v1.use(
  "/messages",
  validateToken,
  express
    .Router()
    .get("/", messageController.getMessages)
    .get("/:messageId", messageController.getMessageDetail)
    .post("/create", messageController.createMessage)
    .put("/edit/:messageId", messageController.editMessage)
    .delete("/delete/:messageId", messageController.deleteMessage)
);

export { v1 };
