import {
  SignUpController,
  EmailValidatorAdapter,
  DbCreateUser,
  BcryptAdapter,
  UserRepository,
} from './signUpProtocols';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const userRepository = new UserRepository();

  const emailValidatorAdapter = new EmailValidatorAdapter();
  const dbCreateUser = new DbCreateUser(bcryptAdapter, userRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, dbCreateUser);

  return signUpController;
};
