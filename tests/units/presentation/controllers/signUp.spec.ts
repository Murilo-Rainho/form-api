import { SignUpController } from '../../../../src/presentation/controllers';

import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../../../src/presentation/errors';

import { EmailValidator } from '../../../../src/presentation/protocols';

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    // In all tests, the email will be valid
    return true;
  }
}

interface FactoriesTypes {
  signUpController: SignUpController;
  emailValidatorStub: EmailValidator;
}

const factories = (): FactoriesTypes => {
  const emailValidatorStub = new EmailValidatorStub();

  const signUpController = new SignUpController(emailValidatorStub);

  return {
    signUpController,
    emailValidatorStub,
  };
};

describe('Signup Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { signUpController } = factories();

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 400 if no email is provided', () => {
    const { signUpController } = factories();

    const httpRequest = {
      body: {
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password is provided', () => {
    const { signUpController } = factories();

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        name: 'My Name',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 if no password confirmation is provided', () => {
    const { signUpController } = factories();

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        name: 'My Name',
        password: 'super_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
  });

  it('Should return 400 if an invalid email is provided', () => {
    const { signUpController, emailValidatorStub } = factories();

    // Just here, the method 'isValid' returns 'false';
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        email: 'my_invalid_email@email.com',
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should call \'isValid\' method of \'emailValidator\' with correct email', () => {
    const { signUpController, emailValidatorStub } = factories();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        email: 'my_invalid_email@email.com',
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    signUpController.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('Should return 500 if has an internal error', () => {
    const { signUpController, emailValidatorStub } = factories();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error('Any internal error') });

    const httpRequest = {
      body: {
        email: 'my_invalid_email@email.com',
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'super_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
