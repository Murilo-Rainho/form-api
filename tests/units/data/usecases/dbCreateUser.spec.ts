import {
  CreateUserRepository,
  DbCreateUser,
  UserResponseData,
  CreateUser,
  UserRequestData,
} from './dbCreateUserProtocols';

class EncrypterStub {
  async encrypt(_password: string): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  }
}

class CreateUserRepositoryStub implements CreateUserRepository {
  async createOne(dataUser: UserRequestData): Promise<UserResponseData> {
    const fakeUser = {
      id: 'any_id',
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'hashed_password',
    };

    return new Promise((resolve) => resolve(fakeUser));
  }
}

interface factoriesTypes {
  dbCreateUser: CreateUser;
  encrypterStub: EncrypterStub;
  createUserRepositoryStub: CreateUserRepositoryStub;
}

const factories = (): factoriesTypes => {
  const encrypterStub = new EncrypterStub();

  const createUserRepositoryStub = new CreateUserRepositoryStub();
  
  const dbCreateUser = new DbCreateUser(encrypterStub, createUserRepositoryStub);

  return {
    dbCreateUser,
    encrypterStub,
    createUserRepositoryStub,
  };
};

describe('database createUser usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { dbCreateUser, encrypterStub } = factories();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await dbCreateUser.createOne({
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'any_password',
    });

    expect(encryptSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw if encrypter throws', async () => {
    const { dbCreateUser, encrypterStub } = factories();

    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error('any_error'))));

    const promise = dbCreateUser.createOne({
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow(new Error('any_error'));
  });

  test('Should call createUserRepository with correct data', async () => {
    const { dbCreateUser, createUserRepositoryStub } = factories();

    const createUserRepositoryStubSpy = jest.spyOn(createUserRepositoryStub, 'createOne');

    await dbCreateUser.createOne({
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'any_password',
    });

    expect(createUserRepositoryStubSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'hashed_password',
    });
  });

  test('Should throw if createUserRepository throws', async () => {
    const { dbCreateUser, createUserRepositoryStub } = factories();

    jest.spyOn(createUserRepositoryStub, 'createOne')
      .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error('any_error'))));

    const promise = dbCreateUser.createOne({
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow(new Error('any_error'));
  });

  test('Should return a created user with "id", "email", "name" and "password"', async () => {
    const { dbCreateUser } = factories();

    const createdUser = await dbCreateUser.createOne({
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'any_password',
    });

    expect(createdUser).toEqual({
      id: 'any_id',
      email: 'any_email@email.com',
      name: 'My Any Name',
      password: 'hashed_password',
    });
  });
});
