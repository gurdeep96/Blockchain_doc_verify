import { Request, Response } from "express";
import userService, { UserService } from "../service/user.service";
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

  async signInUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const response = await userService.signInUser(email, password);
      res.status(200).send({
        status: 200,
        token: response.token,
        username: response.username,
      });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ status: error.status, error: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      console.log("GET USERS called", Date.now());
      const response = await userService.findAllUser();
      res.status(200).send({ status: 200, result: response });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ status: error.status, error: error.message });
    }
  }

  async updateUsers(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await userService.updateUser(Number(id), req.body);
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await userService.deleteUser(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user: IUserInput = req.body;
      const response = await userService.createUser(user);
      res.status(200).send({
        status: 201,
        result: { email: response.email, id: response.id },
        message: "User Created!",
      });
    } catch (error: any) {
      console.log(error);
      res
        .status(error.status || 500)
        .send({ status: error.status, error: error.message });
    }
  }
}
const userController = new UserController();
export default userController;
