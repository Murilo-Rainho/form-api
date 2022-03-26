import { Controller, HttpRequest, HttpResponse } from '../protocols';

import { MissingParamError } from '../errors';
import { badRequest } from '../helpers';

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
