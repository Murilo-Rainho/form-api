import { LoginController } from '../../../../src/presentation/controllers/login';
import { badRequest, MissingParamError } from './signUpProtocols';

const factories = () => {
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
});
