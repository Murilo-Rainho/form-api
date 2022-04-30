import {
  config,
  mongoHelper,
  UserRepository,
  env,
} from './userRepositoryProtocols';

config();

interface FactoriesTypes {
  userRepository: UserRepository;
}

const factories = (): FactoriesTypes => {
  const userRepository = new UserRepository();

  return {
    userRepository,
  };
};

describe('mongodb\'s userRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    const userCollection = await mongoHelper.getCollection('users');
    await userCollection.deleteMany({});
  });

  test('Should return an user on success', async () => {
    const { userRepository } = factories();

    const createdUser = await userRepository.createOne({
      name: 'My Any Name',
      email: 'any_email@email.com',
      password: 'any_password',
    });

    expect(createdUser).toBeTruthy();
    expect(createdUser.id).toBeTruthy();
    expect(createdUser.name).toBe('My Any Name');
    expect(createdUser.email).toBe('any_email@email.com');
    expect(createdUser.password).toBe('any_password');
  });
});
