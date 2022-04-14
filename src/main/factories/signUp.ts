import { SignUpController } from '../../presentation/controllers/signUp';
import { EmailValidatorAdapter } from '../../utils';
import { DbCreateUser } from '../../data/usecases/dbCreateUser';
import { BcryptAdapter } from '../../infra/cryptography';
import { UserRepository } from '../../infra/database/mongodb/userRepository';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const userRepository = new UserRepository();

  const emailValidatorAdapter = new EmailValidatorAdapter();
  const dbCreateUser = new DbCreateUser(bcryptAdapter, userRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, dbCreateUser);

  return signUpController;
};
