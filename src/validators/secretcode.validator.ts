import ResponseError from '@/helpers/response-error.js';

import type { SecretCode } from '@/@types/globals.js';

export function checkValidation(secretCode: Omit<SecretCode, 'user'>) {
  const fields = [
    { key: 'name', value: secretCode.name },
    { key: 'code', value: secretCode.code },
  ];

  for (const field of fields) {
    if (typeof field.value !== 'string') {
      throw new ResponseError(
        400,
        'Invalid Secret Code Added',
        `Secret code storage for ${field.key} only allows storing information in plain text.`,
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
