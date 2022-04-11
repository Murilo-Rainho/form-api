import { Request, Response } from 'express';
import request from 'supertest';
import { app } from '../../../../../src/main/config';

describe('Cors Middleware', () => {
  test('Should enable CORS', async () => {
    app.get('/test_cors', (_req: Request, res: Response) => {
      return res.send();
    });

    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*');
  });
});
