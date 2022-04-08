import { CreateUserRepository } from '../../../../data/protocols';

import { UserResponseData } from '../../../../domain/models';
import { UserRequestData } from '../../../../domain/usecases';

import { mongoHelper } from '../helper';

export class UserRepository implements CreateUserRepository {
  async createOne(userData: UserRequestData): Promise<UserResponseData> {
    const userCollection = mongoHelper.getCollection('users');

    const { insertedId: { id } } = await userCollection
      .insertOne(userData);

    const userId = id.toString();

    const createdUser = {
      id: userId,
      ...userData,
    };

    return createdUser;
  }
}