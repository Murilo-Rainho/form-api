import {
  UserResponseData,
  CreateUser,
  UserRequestData,
  Encrypter,
  CreateUserRepository,
} from './dbCreateUserProtocols';

export class DbCreateUser implements CreateUser {
  private readonly encrypter: Encrypter;

  private readonly dbCreateUserRepository: CreateUserRepository;

  constructor(encrypter: Encrypter, dbCreateUserRepository: CreateUserRepository) {
    this.encrypter = encrypter;

    this.dbCreateUserRepository = dbCreateUserRepository;
  }

  async createOne(userRequestData: UserRequestData): Promise<UserResponseData> {
    const { name, password, email } = userRequestData;

    const hashedPassword = await this.encrypter.encrypt(password);

    const userData: UserRequestData = {
      name,
      email,
      password: hashedPassword,
    };

    const createdUser = await this.dbCreateUserRepository.createOne(userData);

    return createdUser;
  }
}
