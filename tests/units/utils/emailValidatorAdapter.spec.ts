import { EmailValidatorAdapter } from '../../../src/utils';

import { EmailValidator } from '../../../src/presentation/controllers/signUp/signUpProtocols';

const factories = () => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  return {
    emailValidatorAdapter,
  };
};

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator return false', () => {
    const { emailValidatorAdapter } = factories();

    const isValid = emailValidatorAdapter.isValid('invalid_email');

    expect(isValid).toBe(false);
  });
});
