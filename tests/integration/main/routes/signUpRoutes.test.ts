import request from 'supertest';

import { mongoHelper } from '../../../../src/infra/database/mongodb/helper';

import { app } from '../../../../src/main/config';

describe('Sign Up Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    const userCollection = mongoHelper.getCollection('users');
    await userCollection.deleteMany({});
  });

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'My Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      })
      .expect(200);
  });
});
