import { Express, Router } from 'express';
import fastGlob from 'fast-glob';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  fastGlob.sync('**/src/main/routes/index.ts')
    .forEach(async (filePath) => {
      const routeObj = await import(`../../../${filePath}`);
      const routeArray = Object.values(routeObj);
      routeArray.forEach((route: (r: Router) => void) => {
        route(router);
      });
    });
};
