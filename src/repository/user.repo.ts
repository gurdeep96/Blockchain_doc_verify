import db from "../models/index";
import { IUser, IUserInput } from "../interface/user.interface";
import User from "../models/user";
export class UserRepository {
  async findOne(id: number) {
    return await User.findOne({ where: { id: id } });
  }

  async createUser(user: IUser) {
    return await db.User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
}
const userRepository = new UserRepository();
export default userRepository;
