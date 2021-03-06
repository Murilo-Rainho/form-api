import request from 'supertest';
import {
  mongoHelper,
  app,
  env,
} from './signUpRoutesProtocols';

describe('Sign Up Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    const userCollection = await mongoHelper.getCollection('users');
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
