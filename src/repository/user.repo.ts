import db from "../db/models/index";
import { IUser, IUserInput, IUserResponse } from "../interface/user.interface";
import User from "../db/models/user";
import Post from "../db/models/document";
export class UserRepository {
  async findOne(id: number) {
    return await User.findOne({ where: { id: id } });
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email: email } });
  }

  async findAll() {
    return await User.findAll({
      include: {
        model: Post,
        //right: true,
      },
      nest: true,
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
        email: user.email,
        password: user.password,
        role: user.role,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async deleteUser(id: number) {
    return await User.destroy({
      where: {
        id: id,
      },
    });
  }
}
const userRepository = new UserRepository();
export default userRepository;
