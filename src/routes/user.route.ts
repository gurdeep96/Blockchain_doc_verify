import express, { Router } from "express";
import userController from "../controller/user.controller"; // Assuming TypeScript file extension is .ts
import { authMiddleware, adminAuthorize } from "../middleware/authenticate";
import { multerSingle } from "../utils/helper";

const userRouter: Router = express.Router();

userRouter.get(
  "/getUsers",
  authMiddleware,
  //adminAuthorize,
  userController.getUsers
);
userRouter.get("/getUser/:id", authMiddleware, userController.getUser);
userRouter.get("/getFile", userController.getFile);
userRouter.post("/createUser", userController.createUser);
userRouter.post("/signIn", userController.signInUser);
userRouter.post(
  "/fileUpload",
  // authMiddleware,
  multerSingle("document"),
  userController.fileUpload
);
userRouter.put("/updateUser/:id", authMiddleware, userController.updateUsers);
userRouter.delete("/deleteUser/:id", authMiddleware, userController.deleteUser);

export default userRouter;
