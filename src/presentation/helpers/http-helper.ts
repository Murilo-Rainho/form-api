import { ServerError } from '../errors';

import { HttpResponse } from '../protocols';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const internalError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});
