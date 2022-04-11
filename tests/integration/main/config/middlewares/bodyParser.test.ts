import { Request, Response } from 'express';
import request from 'supertest';
import { app } from '../../../../../src/main/config';

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req: Request, res: Response) => {
      return res.send(req.body);
    });

    await request(app)
      .post('/test_body_parser')
      .send({})
      .expect({});
  });
});
