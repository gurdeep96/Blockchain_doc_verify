import db from "../db/models/index";
import { IUser, IUserInput, IUserResponse } from "../interface/user.interface";
import User from "../db/models/user";
import Document from "../db/models/document";
import { Op, Sequelize } from "sequelize";

export class UserRepository {
  async findOne(id: number) {
    return await User.findOne({
      where: { [Op.and]: [{ active: true }, { id: id }] },
    });
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: { [Op.and]: [{ active: true }, { email: email }] },
    });
  }

  async findAll() {
    return await User.findAll({
      attributes: { exclude: ["password", "updatedAt", "active"] },
      // include: {
      //   model: Document,
      //   attributes: [
      //     [Sequelize.fn("COUNT", Sequelize.col("documents.id")), "docCount"],
      //   ],
      //   foreignKey: "userId",
      // },
    });
  }

  async createUser(user: IUser) {
    return await User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  }

  async updateUser(id: number, user: IUser) {
    return await User.update(
      {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async deleteUser(id: number) {
    return await User.update(
      { active: false },
      {
        where: {
          id: id,
        },
      }
    );
  }
}
const userRepository = new UserRepository();
export default userRepository;
