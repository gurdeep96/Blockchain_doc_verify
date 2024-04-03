import { Request, Response } from "express";
import userService from "../service/user.service";
import { IUserInput, IUserResponse } from "../interface/user.interface";
import { pipeline } from "stream";

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
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
  }

  async fileUpload(req: Request, res: Response) {
    try {
      if (!req.file) {
        res.json(400).json({ status: 400, result: "Kindly upload a file" });
      }
      const document = req.file;
      const result = await userService.fileUpload(document);
      res.status(201).send({ status: 201, result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const response = await userService.findAllUser();
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async getFile(req: Request, res: Response) {
    try {
      const { hashId } = req.query;
      if (!hashId) {
        throw new Error("No Hash for File Passed!");
      }
      const { contentType, response } = await userService.getFile(
        hashId as string
      );
      const result = await response.arrayBuffer();
      const buffer = Buffer.from(result);
      res.setHeader("Content-Type", contentType);
      res.status(200).send(buffer);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
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
