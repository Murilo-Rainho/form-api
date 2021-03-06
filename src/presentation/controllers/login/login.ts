import {
  InvalidParamError,
  MissingParamError,
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  internalError,
  Authentication,
  unauthorized,
  successRequest,
} from './loginProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }

      const { body: { email, password } } = httpRequest;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) return unauthorized();

      return successRequest({ accessToken });
    } catch (error) {
      return internalError(error);
    }
  }
}
