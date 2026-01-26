import type { Request, Response } from 'express';

export const index = (_req: Request, res: Response) => {
  res.status(200).json({
    title: 'API Access Restricted',
    message:
      'Sorry, all data from this API is not accessible to you, as it is not intended for public access!',
  });
};
