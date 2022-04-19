import { LogControllerDecorator } from "../../../../src/main/decorators";

import { ServerError } from "../../../../src/presentation/errors";
import { internalError } from "../../../../src/presentation/helpers";
import { Controller, HttpRequest, HttpResponse } from "../../../../src/presentation/protocols";

class ControllerStub implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      body: {
        ...httpRequest.body
      },
      statusCode: 200,
    };

    return new Promise((resolve) => resolve(httpResponse))
  }
}

interface FactoriesTypes {
  logControllerDecorator: LogControllerDecorator;
  controllerStub: ControllerStub;
}

const factories = (): FactoriesTypes => {
  const controllerStub = new ControllerStub()
  const logControllerDecorator = new LogControllerDecorator(controllerStub)
  return {
    logControllerDecorator,
    controllerStub,
  };
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { logControllerDecorator, controllerStub } = factories();

    const spyControllerStub = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'My Any Name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await logControllerDecorator.handle(httpRequest);
    expect(spyControllerStub).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return controller handle response', async () => {
    const { logControllerDecorator } = factories();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'My Any Name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await logControllerDecorator.handle(httpRequest);
    expect(httpResponse).toEqual({ statusCode: 200, body: { ...httpRequest.body } });
  });

  test('Should log error if controller handle statusCode response was \'500\'', async () => {
    const { logControllerDecorator, controllerStub } = factories();

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(() => new Promise((resolve) => resolve(internalError())));
    const spyConsoleLog = jest.spyOn(console, 'log');

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'My Any Name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await logControllerDecorator.handle(httpRequest);
    expect(spyConsoleLog).toHaveBeenCalledWith(new ServerError());
  });
});
