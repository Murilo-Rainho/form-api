import { DbCreateUser } from '../../../../src/data/usecases/dbCreateUser';

import { CreateUser } from '../../../../src/domain/usecases';

class EncrypterStub {
  async encrypt(_password: string): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  }
}

interface factoriesTypes {
  dbCreateUser: CreateUser;
  encrypterStub: EncrypterStub;
}

const factories = (): factoriesTypes => {
  const encrypterStub = new EncrypterStub();
  
  const dbCreateUser = new DbCreateUser(encrypterStub);

  return {
    dbCreateUser,
    encrypterStub,
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
});
