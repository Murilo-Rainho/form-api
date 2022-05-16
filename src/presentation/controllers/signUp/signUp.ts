import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
  CreateUser,
  successRequest,
  internalError,
  badRequest,
  InvalidParamError,
  MissingParamError,
  Validation,
} from './signUpProtocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly createUser: CreateUser;

  private readonly validation: Validation;

  constructor(emailValidator: EmailValidator, createUser: CreateUser, validation: Validation) {
    this.emailValidator = emailValidator;
    this.createUser = createUser;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) return badRequest(new InvalidParamError('email'));

      const dataUser = await this.createUser.createOne({ name, email, password });

      return successRequest(dataUser);
    } catch (error) {
      return internalError(error);
    }
  }
}
