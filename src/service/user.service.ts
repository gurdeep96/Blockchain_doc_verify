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

export class UserService {
  public constructor() {}

  async findOneUser(id: number) {
    return await userRepo.findOne(id);
  }

  async signInUser(email: string, password: string) {
    const user = await userRepo.findByEmail(email);

    if (!user) {
      throw new Error("User not Found!");
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid password!");
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
      return { token: token, username: user.firstName };
    }
  }

  async findAllUser() {
    return await userRepo.findAll();
  }

  async createUser(user: IUserInput) {
    if (!user.password) {
      throw new Error("Password Required!");
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
      throw new Error("Email already exist");
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
