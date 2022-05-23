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

      const { name, email, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) return badRequest(new InvalidParamError('email'));

      const dataUser = await this.createUser.createOne({ name, email, password });

      return successRequest(dataUser);
    } catch (error) {
      return internalError(error);
    }
  }
}
