import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';

import { InvalidParamError, MissingParamError } from '../errors';

import { badRequest, internalError } from '../helpers';

import { CreateUser, UserRequestData } from '../../domain/usecases';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly createUser: CreateUser;

  constructor(emailValidator: EmailValidator, createUser: CreateUser) {
    this.emailValidator = emailValidator;
    this.createUser = createUser;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) return badRequest(new InvalidParamError('email'));

      const userRequestData: UserRequestData = { name, email, password };

      this.createUser.createOne(userRequestData);
    } catch (error) {
      return internalError();
    }
  }
}
