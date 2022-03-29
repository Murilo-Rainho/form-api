import { UserResponseData } from '../../../../src/domain/models';
import { CreateUser, UserRequestData } from '../../../../src/domain/usecases';

import { SignUpController } from '../../../../src/presentation/controllers';
import { EmailValidator } from '../../../../src/presentation/protocols';
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../../../src/presentation/errors';


class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    // In all tests, the email will be valid
    return true;
  }
}

class CreateUserStub implements CreateUser {
  createOne(userRequestData: UserRequestData): UserResponseData {
    const fakeUserResponseData = {
      id: 'my_valid_id',
      name: 'My Valid Name',
      email: 'my_valid_email@email.com',
      password: 'my_valid_password',
    };

    return fakeUserResponseData;
  }
}

interface FactoriesTypes {
  signUpController: SignUpController;
  emailValidatorStub: EmailValidator;
  createUserStub: CreateUser;
}

const factories = (): FactoriesTypes => {
  const emailValidatorStub = new EmailValidatorStub();

  const createUserStub = new CreateUserStub();

  const signUpController = new SignUpController(emailValidatorStub, createUserStub);

  return {
    signUpController,
    createUserStub,
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

  it('Should return 400 if password and password confirmation provided it\'s not equal', () => {
    const { signUpController } = factories();

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
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

  it('Should call addAccount with correct values', () => {
    const { signUpController, createUserStub } = factories();

    jest.spyOn(createUserStub, 'createOne')

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        name: 'My Name',
        password: 'my_valid_password',
        passwordConfirmation: 'my_valid_password',
      },
    };

    signUpController.handle(httpRequest);

    expect(createUserStub.createOne).toHaveBeenCalledWith({
      email: 'my_valid_email@email.com',
      name: 'My Name',
      password: 'my_valid_password',
    });
  });
});
