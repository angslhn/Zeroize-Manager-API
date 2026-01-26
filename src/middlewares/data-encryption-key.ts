import ResponseError from '@/helpers/response-error.js';

import type { Request, Response, NextFunction } from 'express';

export default function dek(req: Request, _res: Response, next: NextFunction) {
  const dek = req.headers['x-vault-key'];

  if (!dek || typeof dek !== 'string') {
    throw new ResponseError(
      400,
      'Missing Vault Key',
      'The X-Vault-Key header is required to process credential data and must be a string.',
    );
  }

  const isHex = /^[0-9a-f]+$/.test(dek);

  if (!isHex || dek.length !== 64) {
    throw new ResponseError(
      400,
      'Invalid Key Format',
      'The X-Vault-Key Header format sent to process the credential data is invalid.',
    );
  }

  next();
}
