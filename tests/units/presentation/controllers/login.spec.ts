import { LoginController } from '../../../../src/presentation/controllers/login';
import { badRequest, EmailValidator, MissingParamError } from './signUpProtocols';

class EmailValidatorStub implements EmailValidator {
  isValid(_email: string): boolean {
    // In all tests, the email will be valid
    return true;
  }
}

interface FactoriesTypes {
  loginController: LoginController;
  emailValidatorStub: EmailValidator;
}

const factories = (): FactoriesTypes => {
  const emailValidatorStub = new EmailValidatorStub();
  const loginController = new LoginController(emailValidatorStub);
  return {
    loginController,
    emailValidatorStub,
  };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { loginController } = factories();
    
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    }

    const httpResponse = await loginController.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { loginController } = factories();
    
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      },
    }

    const httpResponse = await loginController.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { loginController, emailValidatorStub } = factories();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    await loginController.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
});
