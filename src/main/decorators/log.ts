import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse = await this.controller.handle(httpRequest);
      if (httpResponse.statusCode === 500) {
        console.log(httpResponse.body);
      }
      return httpResponse;
    } catch (error) {
      console.log(error);
    }
  }
}
