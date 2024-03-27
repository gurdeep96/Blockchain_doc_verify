export interface IUserInput {
  firstname: string;
  lastname: string;
  email: string;
}

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface IUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
