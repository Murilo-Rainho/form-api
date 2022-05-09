import request from 'supertest';
import {
  Request,
  Response,
  app,
} from './corsProtocols';

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
