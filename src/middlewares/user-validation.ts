import ResponseError from '@/helpers/response-error.js';

import type { Request, Response, NextFunction } from 'express';
import type { Validation } from '@/@types/globals.js';

type CheckValidation = (data: Validation) => void;

export default function validation(checkValidation: CheckValidation) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const { username, password, oldPassword, newPassword }: Validation = req.body;

    const isAuthentication = username && password && !oldPassword && !newPassword;
    const isChangePassword = !username && !password && oldPassword && newPassword;
    const isDeleteAccount = !username && password && !oldPassword && !newPassword;

    const isDataFound = isAuthentication || isChangePassword || isDeleteAccount;

    if (!isDataFound) {
      throw new ResponseError(
        400,
        'Invalid Data Context',
        'The data sent for processing context was not found, this request is invalid.',
      );
    }

    if (
      (isAuthentication && (typeof username !== 'string' || typeof password !== 'string')) ||
      (isChangePassword && (typeof oldPassword !== 'string' || typeof newPassword !== 'string')) ||
      (isDeleteAccount && typeof password !== 'string')
    ) {
      throw new ResponseError(
        400,
        'Invalid Data',
        'There was an error in the data sent because the data type should be a string.',
      );
    }

    checkValidation(req.body);

    next();
  };
}
