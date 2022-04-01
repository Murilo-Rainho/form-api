import { UserResponseData, CreateUser, UserRequestData, Encrypter } from './dbCreateUserProtocols';

export class DbCreateUser implements CreateUser {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async createOne(userRequestData: UserRequestData): Promise<UserResponseData> {
    await this.encrypter.encrypt(userRequestData.password);

    const createdUser: UserResponseData = {
      id: 'any_id',
      ...userRequestData,
    };

    return new Promise((resolve) => resolve(createdUser));
  }
}
