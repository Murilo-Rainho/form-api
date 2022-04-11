import { Request, Response } from 'express';
import request from 'supertest';
import { app } from '../../../../src/main/config';

describe('Content Type Middleware', () => {
  test('Should return default contet type as json', async () => {
    app.get('/test_content_type', (_req: Request, res: Response) => {
      return res.send();
    });

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/);
  });

  test('Should return xml contet type when forced', async () => {
    app.get('/test_content_type_xml', (_req: Request, res: Response) => {
      res.type('xml');
      return res.send();
    });

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/);
  });
});
