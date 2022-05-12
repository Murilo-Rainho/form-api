import {
  LoginController,
  badRequest,
  EmailValidator,
  InvalidParamError,
  MissingParamError,
  internalError,
  Authentication,
  unauthorized,
} from './loginProtocols';

class EmailValidatorStub implements EmailValidator {
  isValid(_email: string): boolean {
    // In all tests, the email will be valid
    return true;
  }
}

class AuthenticationStub implements Authentication {
  auth(_email: string, _password: string): Promise<string> {
    // In all tests, the email will be valid
    return new Promise((resolve) => resolve('token'));
  }
}

interface FactoriesTypes {
  loginController: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: AuthenticationStub;
}

const factories = (): FactoriesTypes => {
  const emailValidatorStub = new EmailValidatorStub();
  const authenticationStub = new AuthenticationStub();
  const loginController = new LoginController(emailValidatorStub, authenticationStub);
  return {
    loginController,
    emailValidatorStub,
    authenticationStub,
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

  test('Should call Authentication with correct value', async () => {
    const { loginController, authenticationStub } = factories();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await loginController.handle(validHttpRequest);
    expect(authSpy).toHaveBeenCalledWith(validHttpRequest.body.email, validHttpRequest.body.password);
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { loginController, authenticationStub } = factories();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await loginController.handle(validHttpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { loginController, authenticationStub } = factories();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((_resolve, reject) => reject(error)));

    const httpResponse = await loginController.handle(validHttpRequest);
    expect(httpResponse).toEqual(internalError(error));
  });
});
