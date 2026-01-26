import ResponseError from '@/helpers/response-error.js';

import type { Request, Response, NextFunction } from 'express';

export default function unknownRoute(req: Request, _res: Response, next: NextFunction) {
  next(
    new ResponseError(
      404,
      'Unknown Route',
      `The route from this endpoint ${req.originalUrl} is unknown and cannot be found on the server.`,
    ),
  );
}
