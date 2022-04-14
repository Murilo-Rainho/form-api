import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => (
  async (req: Request, res: Response): Promise<Response<any>> => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const { body, statusCode } = await controller.handle(httpRequest);

    return res.status(statusCode).json(body);
  }
);
