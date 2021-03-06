import {
  Validation,
  RequiredFieldValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from './signUpProtocols';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
  return new ValidationComposite(validations);
};
