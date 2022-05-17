import {
  SignUpController,
  EmailValidatorAdapter,
  DbCreateUser,
  BcryptAdapter,
  UserRepository,
  LogControllerDecorator,
  Controller,
} from './signUpProtocols';
import { makeSignUpValidation } from './signUpValidation';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const userRepository = new UserRepository();

  const emailValidatorAdapter = new EmailValidatorAdapter();
  const dbCreateUser = new DbCreateUser(bcryptAdapter, userRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbCreateUser,
    makeSignUpValidation(),
  );
  const logControllerDecorator = new LogControllerDecorator(signUpController);

  return logControllerDecorator;
};
