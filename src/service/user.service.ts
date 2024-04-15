import { IUserInput, IUserResponse } from "../interface/user.interface";
import userRepo, { UserRepository } from "../repository/user.repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import {
  infuraIpfsCreate,
  infuraIpfsSave,
  sha256hashAsync,
  thirdwebIpfsCreate,
  thirdwebIpfsDownload,
  thirdwebIpfsUpload,
} from "../utils/helper";
import ipfsClient from "ipfs-http-client";
import createHttpError from "http-errors";
import logger from "../utils/logger";

export class UserService {
  public constructor() {}

  async findOneUser(id: number) {
    try {
      const user = await userRepo.findOne(id);

      logger.info(`Find one user called ${user} `, {
        class: UserService.name,
        function: this.findOneUser.name,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signInUser(email: string, password: string) {
    try {
      const user = await userRepo.findByEmail(email);

      if (!user) {
        throw new createHttpError.Unauthorized("Invalid Credentials!");
      } else if (!(await bcrypt.compare(password, user.password))) {
        throw new createHttpError.Unauthorized("Invalid Credentials!");
      } else {
        const tokenGen = (user: any) => {
          return new Promise((resolve, reject) => {
            jwt.sign(
              { userId: user.id, role: user.role },
              process.env.JWT_SECRET as string,
              { expiresIn: "30m" },
              (err, token) => {
                if (err) {
                  reject("Error in Sign In!");
                } else {
                  resolve(token);
                }
              }
            );
          });
        };
        const token = await tokenGen(user);
        logger.info(`Signed in user ${user.firstName}`, {
          class: UserService.name,
          function: this.signInUser.name,
        });

        return { token: token, username: user.firstName };
      }
    } catch (error) {
      logger.error(`Sign in error ${error}`, {
        class: UserService.name,
        function: this.signInUser.name,
      });
      throw error;
    }
  }

  async findAllUser() {
    try {
      const allUsers = await userRepo.findAll();

      return allUsers;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: IUserInput) {
    if (!user.email) {
      throw new createHttpError.BadRequest("Email Required!");
    }
    if (!user.password) {
      throw new createHttpError.BadRequest("Password Required!");
    }
    const pass = await bcrypt.hash(user.password, 8);
    const createOne = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      password: pass,
      role: user.role ? user.role : undefined,
    };
    const userEmail = await userRepo.findByEmail(user.email);
    if (userEmail) {
      throw new createHttpError.BadRequest("Email already exist");
    }
    return await userRepo.createUser(createOne);
  }

  async updateUser(id: number, user: IUserInput) {
    const createOne = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      role: user.role,
    };
    return await userRepo.updateUser(id, createOne);
  }

  async deleteUser(id: number) {
    return await userRepo.deleteUser(id);
  }
}
const userService = new UserService();
export default userService;
