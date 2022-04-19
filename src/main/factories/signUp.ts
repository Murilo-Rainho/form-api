import { Controller } from '../../presentation/protocols';
import {
  SignUpController,
  EmailValidatorAdapter,
  DbCreateUser,
  BcryptAdapter,
  UserRepository,
  LogControllerDecorator,
} from './signUpProtocols';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const userRepository = new UserRepository();

  const emailValidatorAdapter = new EmailValidatorAdapter();
  const dbCreateUser = new DbCreateUser(bcryptAdapter, userRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, dbCreateUser);
  const logControllerDecorator = new LogControllerDecorator(signUpController);

  return logControllerDecorator;
};
