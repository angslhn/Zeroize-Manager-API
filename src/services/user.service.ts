import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import ResponseError from '@/helpers/response-error.js';

import { Env } from '@/config/env.js';
import { UserModel } from '@/models/User.js';
import { DataEncryptionKey } from '@/utils/crypto.js';

import { CredentialModel } from '@/models/Credential.js';
import { decryptedValues, encryptedValues } from './credential.service.js';

import type { SignOptions } from 'jsonwebtoken';
import type { CredentialDocument, SetPasswordPayload, UserDocument } from '@/@types/globals.js';

type UserAuthPayload = Omit<UserDocument, '_id' | 'metadata'>;

export const create = async (payload: UserAuthPayload) => {
  const { username, password } = payload;

  const user = await UserModel.findOne({ username }).lean();

  if (user) {
    throw new ResponseError(
      409,
      'Username already exists',
      'The username has been registered in the system, please login to continue.',
    );
  }

  const dek = DataEncryptionKey.create();

  const metadata = DataEncryptionKey.encrypt(dek, password);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    username,
    password: hashedPassword,
    metadata,
  });

  const createdUser = newUser.toObject();

  return { id: createdUser._id, username: createdUser.username };
};

export const find = async (payload: UserAuthPayload) => {
  const { username, password } = payload;

  const user = await UserModel.findOne({ username }).lean();

  if (!user) {
    throw new ResponseError(
      401,
      'Incorrect username or password',
      'The username or password you are using cannot be found or is incorrect.',
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ResponseError(
      401,
      'Incorrect username or password',
      'The username or password you are using cannot be found or is incorrect.',
    );
  }

  let dek: string;

  try {
    dek = DataEncryptionKey.decrypt(user.metadata, password).toString('hex');
  } catch {
    throw new ResponseError(
      500,
      'Failed to Open All Credentials',
      'An error occurred while opening all your saved credentials.',
    );
  }

  const userPayload = { id: user._id, username: user.username };

  const signOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: Env.JWT_EXPIRES_IN || '1d',
  };

  const token = jwt.sign(userPayload, Env.JWT_SECRET, signOptions);

  return { username, dek, token };
};

export const set = async (payload: SetPasswordPayload) => {
  const { userId, username, dek, newPassword } = payload;

  const user = await UserModel.findOne({ _id: userId, username });

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

  if (isPasswordMatch) {
    throw new ResponseError(
      400,
      'Password Remains the Same',
      'The previous password change process failed because it is still the same, please use a different password.',
    );
  }

  const oldCredentials = await CredentialModel.find<CredentialDocument>({ user: userId });

  const buffer = DataEncryptionKey.create();

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const metadata = DataEncryptionKey.encrypt(buffer, newPassword);

  const newDek = buffer.toString('hex');

  const bulkOps = oldCredentials.map((credential) => {
    const oldDecrypted = decryptedValues(dek, credential);

    const newEncrypted = encryptedValues(newDek, oldDecrypted);

    return {
      updateOne: {
        filter: { _id: newEncrypted._id },
        update: {
          $set: {
            service: newEncrypted.service,
            account: newEncrypted.account,
            password: newEncrypted.password,
          },
        },
      },
    };
  });

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    await UserModel.updateOne(
      {
        username,
      },
      {
        $set: {
          password: hashedPassword,
          metadata,
        },
      },
      {
        session,
      },
    );

    if (bulkOps.length > 0) {
      await CredentialModel.bulkWrite(bulkOps);
    }

    await session.commitTransaction();

    return newDek;
  } catch {
    await session.abortTransaction();

    throw new ResponseError(
      500,
      'Transaction Failed',
      'Failed to change encryption key. No changes were made to stored credential data.',
    );
  } finally {
    session.endSession();
  }
};

export const eliminate = async (payload: UserAuthPayload & { userId: string }) => {
  const { userId, username, password } = payload;

  const user = await UserModel.findOne({ _id: userId, username });

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ResponseError(
      403,
      'Confirm Wrong Password',
      'The confirmation password to delete your account is incorrect, your account deletion process is cancelled.',
    );
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    await CredentialModel.deleteMany({ user: userId }, { session });

    await UserModel.findByIdAndDelete(userId, { session });

    await session.commitTransaction();
  } catch {
    session.abortTransaction();

    throw new ResponseError(
      500,
      'Transaction Failed',
      'Failed to delete all data. No changes were made to stored credential data.',
    );
  } finally {
    session.endSession();
  }
};
