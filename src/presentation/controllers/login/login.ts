import {
  InvalidParamError,
  MissingParamError,
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  internalError,
} from './loginProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }

      const { body: { email } } = httpRequest;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return new Promise((resolve) => resolve(internalError(error)));
    }
  }
}
