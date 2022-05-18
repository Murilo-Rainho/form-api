import {
  makeSignUpValidation,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from './signUpValidationProtocols';

jest.mock('../../../../src/presentation/helpers/validators/validationComposite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  })
});
