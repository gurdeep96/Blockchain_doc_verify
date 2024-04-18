import { IUserInput, IUserResponse } from "../interface/user.interface";
import userRepo, { UserRepository } from "../repository/user.repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import {
  infuraIpfsCreate,
  infuraIpfsSave,
  randomGen,
  sendEmail,
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
      logger.error(`Error in find user by id : ${id}`, {
        class: UserService.name,
        function: this.findOneUser.name,
      });
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
      logger.info(`Find all users , length : ${allUsers.length}`, {
        class: UserService.name,
        function: this.findAllUser.name,
      });
      return allUsers;
    } catch (error) {
      logger.error(`Error in find all users : ${error}`, {
        class: UserService.name,
        function: this.findAllUser.name,
      });

      throw error;
    }
  }

  async createUser(user: IUserInput) {
    try {
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

      logger.info(`Created new user with email : ${user?.email}`, {
        class: UserService.name,
        function: this.createUser.name,
      });

      return await userRepo.createUser(createOne);
    } catch (error) {
      logger.error(`Error creating new user with email : ${user?.email}`, {
        class: UserService.name,
        function: this.createUser.name,
      });

      throw error;
    }
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

  async sendForgetEmail(email: string) {
    try {
      if (!email) {
        throw new createHttpError.BadRequest("No Email Provided!");
      }
      const user = await userRepo.findByEmail(email);

      if (!user) {
        throw new createHttpError.BadRequest(
          "No User Found with the Email provided"
        );
      }
      const token = randomGen();

      const res = await userRepo.updateToken(user.id, token);
      const sub = "DocVify | Reset Password";
      const text = `<p>To reset your password click on the below link:</p>  <a href="${process.env.FRONTEND_URL}/forget-password/${user.id}/${token}">Click To Reset</a> <br> <p>Thanks DocVify team</p>`;
      const response = await sendEmail(email, sub, text);

      logger.info(`Forget Password email sent to : ${user?.email} `, {
        class: UserService.name,
        function: this.sendForgetEmail.name,
      });
      return response;
    } catch (error) {
      logger.error(`Error in Sending email ${error}`, {
        class: UserService.name,
        function: this.sendForgetEmail.name,
      });
      throw error;
    }
  }

  async forgetPassword(id: number, password: string, token: string) {
    try {
      const user = await userRepo.findOne(id);
      if (!user) {
        throw new createHttpError.BadRequest("User Not Found!");
      }
      if (user.token !== token) {
        throw new createHttpError.BadRequest(
          "Something went wrong. Kindly go back and retry!"
        );
      }

      const pass = await bcrypt.hash(password, 8);
      const result = await userRepo.updatePassword(id, pass);

      await userRepo.updateToken(id, "");

      logger.info(
        `Forget Password reset for user with email id : ${user?.email} done`,
        {
          class: UserService.name,
          function: this.forgetPassword.name,
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      logger.error(`Error in forget password function ${error}`, {
        class: UserService.name,
        function: this.forgetPassword.name,
      });
      throw error;
    }
  }
}
const userService = new UserService();
export default userService;
