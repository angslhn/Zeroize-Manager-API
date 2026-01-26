import { Env } from '@/config/env.js';
import ResponseError from '@/helpers/response-error.js';

import type { Request, Response, NextFunction } from 'express';
import type { GlobalError } from '@/@types/globals.js';

export default function globalError(
  err: GlobalError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = err.statusCode || 500;
  let title = err.title || 'A Process Error Occurred';
  let message =
    err.message || 'An error occurred on the server and it was unable to process the request.';

  if (err instanceof ResponseError) {
    statusCode = err.statusCode;
    title = err.title;
    message = err.message;
  } else if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;

    title = 'Validation Error';

    const errorMessages = Object.values(err.errors).map((error) => error.message);

    message = `Validation Errors: ${errorMessages.join(', ')}`;
  } else if (err.name === 'CastError') {
    statusCode = 400;

    title = 'Cast Error';

    message = `Invalid value for ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;

    title = 'Duplicate Field Value';

    const keyValue = ((err as unknown as { keyValue: Record<string, unknown> }) || {}).keyValue;

    const fields = Object.keys(keyValue).join(', ');

    message = `Duplicate field value entered: ${fields}. Please use another value.`;
  }

  const response: {
    message: string;
    title: string;
    stack?: string;
  } = {
    title,
    message,
  };

  if (Env.NODE_ENV === 'production') {
    if (statusCode === 500) {
      response.title = 'Internal Server Error';
    }

    response.stack = undefined;
  } else {
    console.error(`> ${req.method}`, err);

    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
