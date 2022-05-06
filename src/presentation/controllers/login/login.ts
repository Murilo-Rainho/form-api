import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signUp/signUpProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body: { email, password } } = httpRequest;

    if (!password) {
      return new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))));
    }
    if (!email) {
      return new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))));
    }

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return new Promise((resolve) => resolve(badRequest(new InvalidParamError('email'))));
    }
  }
}
