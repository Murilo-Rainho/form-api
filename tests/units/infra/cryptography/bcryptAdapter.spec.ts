import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcryptAdapterProtocols';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('value_hashed'))
  }
}))

interface FactoriesTypes {
  bcryptAdapter: BcryptAdapter;
  salt: number;
}

const factories = (): FactoriesTypes => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);

  return {
    bcryptAdapter,
    salt,
  };
}

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct data', async () => {
    const { bcryptAdapter, salt } = factories();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await bcryptAdapter.encrypt('any_value');

    expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const { bcryptAdapter } = factories();

    const hash = await bcryptAdapter.encrypt('any_value');

    expect(hash).toBe('value_hashed');
  });

  test('Should throw if bcrypt throws', async () => {
    const { bcryptAdapter } = factories();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => (
      new Promise((_resolve, reject) => reject(new Error('any_error')))
    ));

    const promise = bcryptAdapter.encrypt('any_value');

    await expect(promise).rejects.toThrow(new Error('any_error'));
  });
});
