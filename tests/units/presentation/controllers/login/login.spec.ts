import {
  LoginController,
  badRequest,
  EmailValidator,
  InvalidParamError,
  MissingParamError,
  internalError,
} from './loginProtocols';

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
  const error = new Error('Any internal error');

  const validHttpRequest = {
    body: {
      email: 'any_email@email.com',
      password: 'any_password',
    },
  }

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

  test('Should return 400 if an invalid email is provided', async () => {
    const { loginController, emailValidatorStub } = factories();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password',
      },
    }

    const httpResponse = await loginController.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { loginController, emailValidatorStub } = factories();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await loginController.handle(validHttpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(validHttpRequest.body.email);
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { loginController, emailValidatorStub } = factories();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw error });

    const httpResponse = await loginController.handle(validHttpRequest);
    expect(httpResponse).toEqual(internalError(error));
  });
});
