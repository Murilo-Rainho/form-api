import {
  makeSignUpValidation,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from './signUpValidationProtocols';

jest.mock('../../../../src/presentation/helpers/validators/validationComposite');

const makeValidationArray = () => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return validations;
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations = makeValidationArray();
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  })
});
