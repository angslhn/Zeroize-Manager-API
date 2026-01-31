import { Cipher } from './crypto.js';

import type { CredentialDocument } from '@/@types/globals.js';

export const encrypted = (dek: string, credential: CredentialDocument): CredentialDocument => {
  const decoded = Buffer.from(dek, 'hex');

  return {
    ...(credential._id && { _id: credential._id }),
    ...(credential.user && { user: credential.user }),
    service: Cipher.encrypt(credential.service, decoded),
    account: Cipher.encrypt(credential.account, decoded),
    password: Cipher.encrypt(credential.password, decoded),
  };
};

export const decrypted = (dek: string, credential: CredentialDocument): CredentialDocument => {
  const decoded = Buffer.from(dek, 'hex');

  return {
    ...(credential._id && { _id: credential._id }),
    ...(credential.user && { user: credential.user }),
    service: Cipher.decrypt(credential.service, decoded),
    account: Cipher.decrypt(credential.account, decoded),
    password: Cipher.decrypt(credential.password, decoded),
  };
};
