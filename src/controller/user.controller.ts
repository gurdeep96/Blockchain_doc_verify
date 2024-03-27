import { Request, Response } from "express";
import userService from "../service/user.service";
import { IUserInput, IUserResponse } from "../interface/user.interface";

export class UserController {
  constructor() {}
  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await userService.findOneUser(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user: IUserInput = req.body;
      const response = await userService.createUser(user);
      res
        .status(200)
        .send({ status: 201, result: response, message: "User Created!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
}
const userController = new UserController();
export default userController;
