import { SignUpController } from '../../../../src/presentation/controllers';

describe('Signup Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const signupController = new SignUpController();

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signupController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name'));
  });

  it('Should return 400 if no email is provided', () => {
    const signupController = new SignUpController();

    const httpRequest = {
      body: {
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signupController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: email'));
  });
});
