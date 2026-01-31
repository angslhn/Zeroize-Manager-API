import { UserModel } from '@/models/User.js';
import { SecretCodeModel } from '@/models/SecretCode.js';

import * as SecretCode from '@/utils/secretcode-values.js';

import ResponseError from '@/helpers/response-error.js';

import type { AuthPayload, SecretCodeDocument, SecretCodePayload } from '@/@types/globals.js';

export const find = async (payload: AuthPayload) => {
  const { userId, dek } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const encrypted = await SecretCodeModel.find<SecretCodeDocument>({
    user: userId,
  });

  const decrypted = encrypted.map((code) => SecretCode.decrypted(dek, code));

  return decrypted;
};

export const add = async (payload: SecretCodePayload): Promise<SecretCodeDocument> => {
  const { userId, dek, ...code } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const newDocument = await SecretCodeModel.create({
    ...SecretCode.encrypted(dek, code),
    user: userId,
  });

  return { ...code, _id: newDocument._id, user: userId };
};

export const findAndEdit = async (payload: SecretCodePayload) => {
  const { userId, dek, ...code } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const updatedDocument = await SecretCodeModel.findOneAndUpdate(
    {
      _id: code._id,
      user: userId,
    },
    { ...SecretCode.encrypted(dek, code) },
    {
      runValidators: true,
      new: true,
    },
  ).lean();

  if (!updatedDocument) {
    throw new ResponseError(
      404,
      'Code Not Found',
      'Failed to update secret code. Either the ID is wrong, or you do not own this data.',
    );
  }

  return code;
};

export const findAndRemove = async (payload: Pick<SecretCodePayload, 'userId' | '_id'>) => {
  const { userId, _id } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const removedDocument = await SecretCodeModel.findOneAndDelete({
    _id,
    user: userId,
  });

  if (!removedDocument) {
    throw new ResponseError(
      404,
      'Code Not Found',
      'The secret code you are attempting to delete could not be found. It may have already been removed, or you do not have permission to access this resource.',
    );
  }

  return removedDocument._id;
};
