import { UserModel } from '@/models/User.js';
import { CredentialModel } from '@/models/Credential.js';
import { CredentialValue } from '@/utils/crypto.js';

import ResponseError from '@/helpers/response-error.js';

import type { AuthPayload, CredentialDocument, CredentialPayload } from '@/@types/globals.js';

export const encryptedValues = (
  dek: string,
  credential: CredentialDocument,
): CredentialDocument => {
  const decoded = Buffer.from(dek, 'hex');

  return {
    ...(credential._id && { _id: credential._id }),
    ...(credential.user && { user: credential.user }),
    service: CredentialValue.encrypt(credential.service, decoded),
    account: CredentialValue.encrypt(credential.account, decoded),
    password: CredentialValue.encrypt(credential.password, decoded),
  };
};

export const decryptedValues = (
  dek: string,
  credential: CredentialDocument,
): CredentialDocument => {
  const decoded = Buffer.from(dek, 'hex');

  return {
    ...(credential._id && { _id: credential._id }),
    ...(credential.user && { user: credential.user }),
    service: CredentialValue.decrypt(credential.service, decoded),
    account: CredentialValue.decrypt(credential.account, decoded),
    password: CredentialValue.decrypt(credential.password, decoded),
  };
};

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

  const decrypted = encrypted.map((credential) => decryptedValues(dek, credential));

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
    ...encryptedValues(dek, credential),
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
    { ...encryptedValues(dek, credential) },
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

export const findAndDelete = async (payload: Pick<CredentialPayload, 'userId' | '_id'>) => {
  const { userId, _id } = payload;

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new ResponseError(
      404,
      'User Not Found',
      'Your request cannot be processed because the user cannot be found.',
    );
  }

  const deletedDocument = await CredentialModel.findOneAndDelete({
    _id,
    user: userId,
  });

  if (!deletedDocument) {
    throw new ResponseError(
      404,
      'Credential Not Found',
      'The credential you are attempting to delete could not be found. It may have already been deleted, or you do not have permission to access this resource.',
    );
  }

  return deletedDocument._id;
};
