import { LoginController } from '../../../../src/presentation/controllers/login';
import { badRequest, MissingParamError } from './signUpProtocols';

interface FactoriesTypes {
  loginController: LoginController;
}

const factories = (): FactoriesTypes => {
  const loginController = new LoginController();
  return {
    loginController,
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
});
