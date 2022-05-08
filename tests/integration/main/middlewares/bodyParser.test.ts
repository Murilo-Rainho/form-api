import request from 'supertest';
import {
  Request,
  Response,
  app,
} from './bodyParserProtocols';

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
