import { Router } from 'express';
import { adaptRoute } from '../adapters';
import { makeSignUpController } from '../factories';

export const signUpPost = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
