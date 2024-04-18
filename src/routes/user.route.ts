import express, { Router } from "express";
import userController from "../controller/user.controller"; // Assuming TypeScript file extension is .ts
import { authMiddleware, adminAuthorize } from "../middleware/auth";

const userRouter: Router = express.Router();

userRouter.get("/getusers", authMiddleware, userController.getUsers);
userRouter.get("/getuser/:id", authMiddleware, userController.getUser);
userRouter.post("/auth/createuser", userController.createUser);
userRouter.post("/auth/signin", userController.signInUser);
userRouter.put("/auth/forget-password/:id", userController.resetPassword);
userRouter.post("/auth/send-forget-mail", userController.sendForgetEmail);
userRouter.put("/updateuser/:id", authMiddleware, userController.updateUsers);
userRouter.delete("/deleteuser/:id", authMiddleware, userController.deleteUser);

export default userRouter;
