import {
  UserResponseData,
  CreateUser,
  UserRequestData,
  EmailValidator,
  SignUpController,
  InvalidParamError,
  ServerError,
  Validation,
  badRequest,
} from './signUpProtocols';

class EmailValidatorStub implements EmailValidator {
  isValid(_email: string): boolean {
    // In all tests, the email will be valid
    return true;
  }
}

class CreateUserStub implements CreateUser {
  async createOne(_userRequestData: UserRequestData): Promise<UserResponseData> {
    const fakeUserResponseData = {
      id: 'my_valid_id',
      name: 'My Valid Name',
      email: 'my_valid_email@email.com',
      password: 'my_valid_password',
    };

    return new Promise((resolve) => resolve(fakeUserResponseData));
  }
}

class ValidationStub implements Validation {
  validate(_input: any): Error {
    return null
  }
}

interface FactoriesTypes {
  signUpController: SignUpController;
  emailValidatorStub: EmailValidator;
  createUserStub: CreateUser;
  validationStub: ValidationStub;
}

const factories = (): FactoriesTypes => {
  const emailValidatorStub = new EmailValidatorStub();

  const createUserStub = new CreateUserStub();

  const validationStub = new ValidationStub();

  const signUpController = new SignUpController(emailValidatorStub, createUserStub, validationStub);

  return {
    signUpController,
    createUserStub,
    emailValidatorStub,
    validationStub,
  };
};

describe('Signup Controller', () => {
  const error = new Error('Any internal error');

  const validHttpRequest = {
    body: {
      email: 'my_valid_email@email.com',
      name: 'My Name',
      password: 'my_valid_password',
      passwordConfirmation: 'my_valid_password',
    },
  };

  it('Should return 400 if password and password confirmation provided it\'s not equal', async () => {
    const { signUpController } = factories();

    const httpRequest = {
      body: {
        email: 'my_valid_email@email.com',
        name: 'My Name',
        password: 'super_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
  });

  it('Should return 400 if an invalid email is provided', async () => {
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

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should call \'isValid\' method of \'emailValidator\' with correct email', async () => {
    const { signUpController, emailValidatorStub } = factories();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await signUpController.handle(validHttpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(validHttpRequest.body.email);
  });

  it('Should return 500 if has an internal error in \'emailValidator\'', async () => {
    const { signUpController, emailValidatorStub } = factories();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw error });

    const httpResponse = await signUpController.handle(validHttpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(error.stack));
  });

  it('Should return 500 if has an internal error in \'createUser\'', async () => {
    const { signUpController, createUserStub } = factories();

    jest.spyOn(createUserStub, 'createOne').mockImplementationOnce(async () => {
      return new Promise((_resolve, reject) => reject(error));
    });

    const httpResponse = await signUpController.handle(validHttpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(error.stack));
  });

  it('Should call addAccount with correct values', async () => {
    const { signUpController, createUserStub } = factories();

    const createOneSpy = jest.spyOn(createUserStub, 'createOne');

    await signUpController.handle(validHttpRequest);

    expect(createOneSpy).toHaveBeenCalledWith({
      email: 'my_valid_email@email.com',
      name: 'My Name',
      password: 'my_valid_password',
    });
  });

  it('Should return 200 if valid data is provided', async () => {
    const { signUpController } = factories();

    const userResponse = {
      id: 'my_valid_id',
      name: 'My Valid Name',
      email: 'my_valid_email@email.com',
      password: 'my_valid_password',
    };

    const httpResponse = await signUpController.handle(validHttpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(userResponse);
  });

  it('Should call Validation with correct values', async () => {
    const { signUpController, validationStub } = factories();

    const createOneSpy = jest.spyOn(validationStub, 'validate');

    await signUpController.handle(validHttpRequest);

    expect(createOneSpy).toHaveBeenCalledWith(validHttpRequest.body);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { signUpController, validationStub } = factories();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error);

    const httpResponse = await signUpController.handle(validHttpRequest);

    expect(httpResponse).toEqual(badRequest(error));
  });
});
