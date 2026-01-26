import mongoose from 'mongoose';
import type { Types } from 'mongoose';
import type { StringValue } from 'ms';

export type EnvOption = {
  PORT: number;
  NODE_ENV: string;
  ORIGIN: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: StringValue;
  MONGODB_URI: string;
};

export interface GlobalError extends Error {
  title?: string;
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
  value?: string;
  path?: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export type EncryptionMetadata = {
  key: string;
  salt: string;
  iv: string;
  auth_tag: string;
};

export type User = {
  username: string;
  password: string;
  metadata: EncryptionMetadata;
};

export type UserDocument = {
  _id?: Types.ObjectId | string;
} & User;

export type Credential = {
  user?: Types.ObjectId | string;
  service: string;
  account: string;
  password: string;
};

export type CredentialDocument = {
  _id?: Types.ObjectId | string;
} & Credential;

export type TokenPayload = { id: string; username: string };

export type AuthPayload = { userId: string; dek: string };

export type CredentialPayload = AuthPayload & CredentialDocument;

export type SetPasswordPayload = {
  dek: string;
  username: string;
  userId: string;
  oldPassword: string;
  newPassword: string;
};

export type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

export type Validation = {
  username: string;
  password: string;
  oldPassword: string;
  newPassword: string;
};
