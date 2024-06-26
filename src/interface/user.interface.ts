export interface IUserInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role?: string;
}

export interface IUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  accountAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStorageSum {
  SUM: number;
}
