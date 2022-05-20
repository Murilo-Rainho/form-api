import validator from 'validator';

import {
  EmailValidator,
  EmailValidatorAdapter,
} from './emailValidatorAdapterProtocols';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

interface FactoriesTypes {
  emailValidatorAdapter: EmailValidator;
}

const factories = (): FactoriesTypes => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  return {
    emailValidatorAdapter,
  };
};

describe('EmailValidatorAdapter', () => {
  const validEmail = 'valid_email@email.com';

  test('Should return false if validator return false', () => {
    const { emailValidatorAdapter } = factories();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator return true', () => {
    const { emailValidatorAdapter } = factories();

    const isValid = emailValidatorAdapter.isValid(validEmail);

    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const { emailValidatorAdapter } = factories();

    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    emailValidatorAdapter.isValid(validEmail);

    expect(isEmailSpy).toHaveBeenCalledWith(validEmail);
  });
});
