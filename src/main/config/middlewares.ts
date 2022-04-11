import { Express } from 'express';
import {
  bodyParser,
  cors,
} from './middlewares/index'; // why index is not found by defaul??

export default (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
};
