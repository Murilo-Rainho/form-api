import bcrypt from 'bcrypt';

import { BcryptAdapter } from '../../../../src/infra/cryptography';

interface FactoriesTypes {
  bcryptAdapter: BcryptAdapter;
}

const factories = (): FactoriesTypes => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);

  return {
    bcryptAdapter,
  };
}

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct data', async () => {
    const { bcryptAdapter } = factories();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await bcryptAdapter.encrypt('any_value');

    expect(hashSpy).toHaveBeenLastCalledWith('any_value', 12);
  });
});
