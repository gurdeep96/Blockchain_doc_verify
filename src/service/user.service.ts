import { IUserInput, IUserResponse } from "../interface/user.interface";
import { UserRepository } from "../repository/user.repo";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as fsPromise from "fs/promises";
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
  private userRepo: UserRepository;
  private ipfs: any;
  public constructor() {
    this.userRepo = new UserRepository();
  }

  async findOneUser(id: number) {
    return await this.userRepo.findOne(id);
  }

  async signInUser(email: string, password: string) {
    const userEmail = await this.userRepo.findByEmail(email);

    if (!userEmail) {
      throw new Error("User not Found!");
    } else if (!(await bcrypt.compare(password, userEmail.password))) {
      throw new Error("Invalid password!");
    } else {
      const token = await jwt.sign(
        { userId: userEmail.id, email: email },
        "secret1",
        { expiresIn: "15m" }
      );
      return token;
    }
  }

  async findAllUser() {
    return await this.userRepo.findAll();
  }

  async createUser(user: IUserInput) {
    if (!user.password || !user.role) {
      throw new Error("Password Required!");
    }
    const pass = await bcrypt.hash(user.password, 8);
    const createOne = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      password: pass,
      role: user.role,
    };
    console.log(createOne);
    const userEmail = await this.userRepo.findByEmail(user.email);
    if (userEmail) {
      throw new Error("Email already exist");
    }
    return await this.userRepo.createUser(createOne);
  }

  async updateUser(id: number, user: IUserInput) {
    const createOne = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      //password: user.password,
      role: user.role,
    };
    return await this.userRepo.updateUser(id, createOne);
  }

  async deleteUser(id: number) {
    return await this.userRepo.deleteUser(id);
  }
  async getFile(hashId: string) {
    const response = await fetch(`https://cloudflare-ipfs.com/ipfs/${hashId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`File not found on IPFS for hash`);
    }
    const contentType = response.headers.get("Content-Type") as string;
    return { contentType, response };
  }

  async fileUpload(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new Error("File is Required!");
    }
    if (!this.ipfs) {
      this.ipfs = await thirdwebIpfsCreate();
    }
    const fsInputStream = fs.createReadStream(file.path);
    const hashed = await sha256hashAsync(fsInputStream);
    const readFile = await fsPromise.readFile(file.path);
    const fileSave = await thirdwebIpfsUpload(this.ipfs, readFile);

    return fileSave.split("//")[1];

    // const fileDownload = await thirdwebIpfsDownload(this.ipfs, fileSave);
    // console.log(fileDownload, fileDownload.body);
    // return { contentType: null, result: fileDownload };
  }
}
const userService = new UserService();
export default userService;
