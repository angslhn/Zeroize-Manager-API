import { UserModel } from '@/models/User.js';
import { CredentialModel } from '@/models/Credential.js';

import * as Credential from '@/utils/credential-values.js';

import ResponseError from '@/helpers/response-error.js';

import type { AuthPayload, CredentialDocument, CredentialPayload } from '@/@types/globals.js';

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

  const encrypted = await CredentialModel.find<CredentialDocument>({
    user: userId,
  });

  const decrypted = encrypted.map((credential) => Credential.decrypted(dek, credential));

  return decrypted;
};

export const add = async (payload: CredentialPayload): Promise<CredentialDocument> => {
  const { userId, dek, ...credential } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const newDocument = await CredentialModel.create({
    ...Credential.encrypted(dek, credential),
    user: userId,
  });

  return { ...credential, _id: newDocument._id, user: userId };
};

export const findAndEdit = async (payload: CredentialPayload) => {
  const { userId, dek, ...credential } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const updatedDocument = await CredentialModel.findOneAndUpdate(
    {
      _id: credential._id,
      user: userId,
    },
    { ...Credential.encrypted(dek, credential) },
    {
      runValidators: true,
      new: true,
    },
  ).lean();

  if (!updatedDocument) {
    throw new ResponseError(
      404,
      'Credential Not Found',
      'Failed to update credential. Either the ID is wrong, or you do not own this credential.',
    );
  }

  return credential;
};

export const findAndRemove = async (payload: Pick<CredentialPayload, 'userId' | '_id'>) => {
  const { userId, _id } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const removedDocument = await CredentialModel.findOneAndDelete({
    _id,
    user: userId,
  });

  if (!removedDocument) {
    throw new ResponseError(
      404,
      'Credential Not Found',
      'The credential you are attempting to remove could not be found. It may have already been removed, or you do not have permission to access this resource.',
    );
  }

  return removedDocument._id;
};
