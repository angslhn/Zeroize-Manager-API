import type { Request, Response } from 'express';

export const index = (_req: Request, res: Response) => {
  res.status(200).json({
    title: 'API Access Restricted',
    message:
      'Sorry, all data from this API is not accessible to you, as it is not intended for public access!',
  });
};

export const limit = (_req: Request, res: Response) => {
  res.status(429).json({
    title: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again after 15 minutes!',
  });
};
