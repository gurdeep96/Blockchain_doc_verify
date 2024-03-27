import { IUserInput } from "../interface/user.interface";
import { UserRepository } from "../repository/user.repo";

export class UserService {
  private userRepo: UserRepository;
  public constructor() {
    this.userRepo = new UserRepository();
  }

  public async findOneUser(id: number) {
    return await this.userRepo.findOne(id);
  }

  public async createUser(user: IUserInput) {
    const createOne = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
    };
    return await this.userRepo.createUser(createOne);
  }
}
const userService = new UserService();
export default userService;
