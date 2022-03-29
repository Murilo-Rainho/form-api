import { UserResponseData } from '../models';

export interface UserRequestData {
  name: string;
  email: string;
  password: string;
}

export interface CreateUser {
  createOne(userRequestData: UserRequestData): UserResponseData;
}
