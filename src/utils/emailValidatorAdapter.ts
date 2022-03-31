import { EmailValidator } from '../presentation/controllers/signUp/signUpProtocols';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(_email: string): boolean {
    return false;
  }
}
