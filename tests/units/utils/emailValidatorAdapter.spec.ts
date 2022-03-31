import { EmailValidatorAdapter } from '../../../src/utils';

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

  test('Should return true if validator return true', () => {
    const { emailValidatorAdapter } = factories();

    const isValid = emailValidatorAdapter.isValid('valid_email@email.com');

    expect(isValid).toBe(true);
  });
});
