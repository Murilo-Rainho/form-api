import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signUp/signUpProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.password) {
      return new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))));
    }
    if (!httpRequest.body.email) {
      return new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))));
    }

    const { body: { email } } = httpRequest;

    this.emailValidator.isValid(email);
  }
}
