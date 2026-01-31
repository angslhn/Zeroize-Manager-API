import ResponseError from '@/helpers/response-error.js';
import { checkValidation } from '@/validators/secretcode.validator.js';

import type { Request, Response, NextFunction } from 'express';
import type { SecretCodeDocument } from '@/@types/globals.js';

export default function validation(req: Request, _res: Response, next: NextFunction) {
  const { _id, user, name, code }: SecretCodeDocument = req.body;

  if (!name || !code) {
    throw new ResponseError(
      400,
      'Data Must Be Filled In',
      'Make sure all your code data information is filled in completely.',
    );
  }

  const isValidObjectId = (value: string) => /^[0-9a-f]{24}$/.test(value);

  if (_id && !isValidObjectId(_id as string)) {
    throw new ResponseError(
      400,
      'Invalid Code ID',
      'The ID code format is invalid for processing changes to stored code data.',
    );
  }

  if (user && !isValidObjectId(user as string)) {
    throw new ResponseError(
      400,
      'Invalid User ID',
      'The ID user format is invalid for processing changes to stored code data.',
    );
  }

  checkValidation({ name, code });

  next();
}
