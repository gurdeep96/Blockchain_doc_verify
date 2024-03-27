import express, { Router } from "express";
import userController from "../controller/user.controller"; // Assuming TypeScript file extension is .ts
// import AuthController from "../controllers/auth.controller.ts"; // Assuming TypeScript file extension is .ts
// import JwtAuth from "../middleware/jwtAuth.ts"; // Assuming TypeScript file extension is .ts

const userRouter: Router = express.Router();

// router.get("/getUsers/:page", UserController.getUsers);
userRouter.get("/getUser/:id", userController.getUser);
userRouter.post("/createUser", userController.createUser);
// router.put("/updateUser/:id", UserController.updateUser);
// router.delete("/deleteUser/:id", UserController.deleteUser);

export default userRouter;
