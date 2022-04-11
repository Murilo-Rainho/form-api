import request from 'supertest';
import { app } from '../../../../src/main/config';

describe('Sign Up Routes', () => {
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
