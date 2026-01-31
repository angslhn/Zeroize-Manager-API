import ResponseError from '@/helpers/response-error.js';

import type { Credential } from '@/@types/globals.js';

export function checkValidation(credential: Omit<Credential, 'user'>) {
  const fields = [
    { key: 'service', value: credential.service },
    { key: 'account', value: credential.account },
    { key: 'password', value: credential.password },
  ];

  for (const field of fields) {
    if (typeof field.value !== 'string') {
      throw new ResponseError(
        400,
        'Invalid Credential Added',
        `Credential storage for ${field.key} only allows storing information in plain text.`,
      );
    }

    if (field.value.trim() === '') {
      throw new ResponseError(
        400,
        'Empty Field Detected',
        `The ${field.key} field cannot be empty or contain only whitespace.`,
      );
    }
  }
}
