import { Cipher } from './crypto.js';

import type { SecretCodeDocument } from '@/@types/globals.js';

export const encrypted = (dek: string, code: SecretCodeDocument): SecretCodeDocument => {
  const decoded = Buffer.from(dek, 'hex');

  return {
    ...(code._id && { _id: code._id }),
    ...(code.user && { user: code.user }),
    name: Cipher.encrypt(code.name, decoded),
    code: Cipher.encrypt(code.code, decoded),
  };
};

export const decrypted = (dek: string, code: SecretCodeDocument): SecretCodeDocument => {
  const decoded = Buffer.from(dek, 'hex');

  return {
    ...(code._id && { _id: code._id }),
    ...(code.user && { user: code.user }),
    name: Cipher.decrypt(code.name, decoded),
    code: Cipher.decrypt(code.code, decoded),
  };
};
