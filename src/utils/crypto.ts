import crypto from 'crypto';

import type { EncryptionMetadata } from '@/@types/globals.js';

const ALGORITHM = 'aes-256-gcm';

export const DataEncryptionKey = {
  create(): Buffer {
    return crypto.randomBytes(32);
  },

  encrypt(dataEncryptionKey: Buffer, password: string): EncryptionMetadata {
    const salt = crypto.randomBytes(16);

    const kek = crypto.scryptSync(password, salt, 32);

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM, kek, iv);

    let key = cipher.update(dataEncryptionKey);

    key = Buffer.concat([key, cipher.final()]);

    const authTag = cipher.getAuthTag();

    return {
      key: key.toString('base64'),
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      auth_tag: authTag.toString('base64'),
    };
  },

  decrypt(metadata: EncryptionMetadata, password: string): Buffer {
    const salt = Buffer.from(metadata.salt, 'base64');

    const kek = crypto.scryptSync(password, salt, 32);

    const key = Buffer.from(metadata.key, 'base64');
    const iv = Buffer.from(metadata.iv, 'base64');
    const authTag = Buffer.from(metadata.auth_tag, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, kek, iv);

    decipher.setAuthTag(authTag);

    const dek = decipher.update(key);

    return Buffer.concat([dek, decipher.final()]);
  },
};

export const CredentialValue = {
  encrypt(text: string, dataEncryptionKey: Buffer): string {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM, dataEncryptionKey, iv);

    let encrypted = cipher.update(text, 'utf-8', 'base64');

    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag().toString('base64');

    return `${iv.toString('base64')}:${authTag}:${encrypted}`;
  },

  decrypt(ciphertext: string, dataEncryptionKey: Buffer): string {
    const [iv, authTag, content] = ciphertext.split(':');

    if (!iv || !authTag || !content) {
      throw new Error('Invalid ciphertext format');
    }

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      dataEncryptionKey,
      Buffer.from(iv, 'base64'),
    );

    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted = decipher.update(content, 'base64', 'utf-8');

    decrypted += decipher.final('utf-8');

    return decrypted;
  },
};
