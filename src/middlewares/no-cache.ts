import type { Request, Response, NextFunction } from 'express';

export default function noCache(_req: Request, res: Response, next: NextFunction) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  next();
}
