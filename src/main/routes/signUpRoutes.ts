import { Request, Response, Router } from 'express';

export default (router: Router): void => {
  router.post('/signup', (_req: Request, res: Response) => res.status(200).json({ ok: 'ok' }));
};
