import { Response, Request, Router } from "express";
import { authentication } from "../middlewares/authentication";
import { authorization } from "../middlewares/authorization";
import { userController, userId } from "../controllers/userController";
import villageController from "../controllers/villageController";
import messageController from "../controllers/messageController";
import { CustomRequest } from "../../types/rest.types";
import { PATH } from "../../consts/url";

const v1: Router = Router();

v1.use(
  Router()
    .get(PATH.HEALTH, (req: Request, res: Response) => {
      res.status(200).json("It Works!!");
    })
    .get(PATH.ME, authentication, (req: CustomRequest, res: Response) =>
      res.status(200).json({ currentUser: req.currentUser })
    )
);

v1.use(
  PATH.USERS,
  authentication,
  Router()
    .get("/", userController.getUsers)
    .get(`/:${userId}`, userController.getUserDetail)
    .get(`/:${userId}${PATH.MESSAGES}`, userController.getUserMessages)
    .get(`/:${userId}${PATH.VILLAGES}`, userController.getUserVillages)
    .post("/", authorization, userController.createUser)
    .patch(`/:${userId}`, userController.editUser)
    .delete(`/:${userId}`, userController.deleteUser)
);

v1.use(
  PATH.VILLAGES,
  authentication,
  Router()
    .get("/", villageController.getVillages)
    .get("/:villageId", villageController.getVillageDetail)
    .post("/create", villageController.createVillage)
    .put("/edit/:villageId", villageController.editVillage)
    .put("/leave/:villageId", villageController.leaveVillage)
    .delete("/delete/:villageId", villageController.deleteVillage)
);

v1.use(
  PATH.MESSAGES,
  authentication,
  Router()
    .get("/", messageController.getMessages)
    .get("/:messageId", messageController.getMessageDetail)
    .post("/create", messageController.createMessage)
    .put("/edit/:messageId", messageController.editMessage)
    .delete("/delete/:messageId", messageController.deleteMessage)
);

export { v1 };
