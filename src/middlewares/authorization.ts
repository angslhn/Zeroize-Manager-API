import jwt from 'jsonwebtoken';
import ResponseError from '@/helpers/response-error.js';
import { Env } from '@/config/env.js';

import type { Request, Response, NextFunction } from 'express';
import type { TokenPayload } from '@/@types/globals.js';

export default function authorization(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw new ResponseError(
      401,
      'Access Request Denied',
      'An error occurred while processing your request, authentication token not found.',
    );
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    throw new ResponseError(
      401,
      'Invalid Authentication Token Format',
      'The user authentication token format is invalid to continue the request process.',
    );
  }

  try {
    const payload = jwt.verify(token, Env.JWT_SECRET) as TokenPayload;

    req.user = payload;

    next();
  } catch {
    throw new ResponseError(
      401,
      'Invalid Authentication Token',
      'The user authentication token is invalid or has expired to continue the request process.',
    );
  }
}
