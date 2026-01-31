import ResponseError from '@/helpers/response-error.js';
import { checkValidation } from '@/validators/credential.validator.js';

import type { Request, Response, NextFunction } from 'express';
import type { CredentialDocument } from '@/@types/globals.js';

export default function validation(req: Request, _res: Response, next: NextFunction) {
  const { _id, user, service, account, password }: CredentialDocument = req.body;

  if (!service || !account || !password) {
    throw new ResponseError(
      400,
      'Data Must Be Filled In',
      'Make sure all your credential data information is filled in completely.',
    );
  }

  const isValidObjectId = (value: string) => /^[0-9a-f]{24}$/.test(value);

  if (_id && !isValidObjectId(_id as string)) {
    throw new ResponseError(
      400,
      'Invalid Credential ID',
      'The ID credential format is invalid for processing changes to stored credential data.',
    );
  }

  if (user && !isValidObjectId(user as string)) {
    throw new ResponseError(
      400,
      'Invalid User ID',
      'The ID user format is invalid for processing changes to stored credential data.',
    );
  }

  checkValidation({ service, account, password });

  next();
}
