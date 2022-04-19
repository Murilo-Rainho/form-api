import { LogControllerDecorator } from "../../../../src/main/decorators";
import { Controller, HttpRequest, HttpResponse } from "../../../../src/presentation/protocols";

class ControllerStub implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      body: {
        ...httpRequest
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

    const spyControllerStub = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'My Any Name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await logControllerDecorator.handle(httpRequest);
    expect(spyControllerStub).toHaveBeenCalledWith(httpRequest)
  });
});
