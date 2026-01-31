import database from '@/lib/database.js';

import * as CredentialService from '@/services/credential.service.js';

import type { Request, Response } from 'express';
import type { AuthPayload, CredentialPayload } from '@/@types/globals.js';

export const findCredentials = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload: AuthPayload = { userId: req.user?.id as string, dek: dek as string };

  await database();

  const result = await CredentialService.find(payload);

  res.status(200).json({
    data: { credentials: result },
  });
};

export const addCredential = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload: CredentialPayload = {
    ...req.body,
    userId: req.user?.id,
    dek,
    service: req.body.service.trim(),
    account: req.body.account.trim(),
    password: req.body.password.trim(),
  };

  await database();

  const result = await CredentialService.add(payload);

  res.status(201).json({
    data: { credential: result },
    title: 'Credential Successfully Added!',
  });
};

export const editCredential = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload: CredentialPayload = {
    ...req.body,
    userId: req.user?.id,
    _id: req.body._id.trim(),
    user: req.body.user.trim(),
    service: req.body.service.trim(),
    account: req.body.account.trim(),
    password: req.body.password.trim(),
    dek,
  };

  await database();

  const result = await CredentialService.findAndEdit(payload);

  res.status(200).json({
    data: { credential: result },
    title: 'Credentials Changed Successfully!',
  });
};

export const removeCredential = async (req: Request, res: Response) => {
  const payload: Pick<CredentialPayload, 'userId' | '_id'> = {
    userId: req.user?.id,
    ...req.body,
  };

  await database();

  const _id = await CredentialService.findAndRemove(payload);

  res.status(200).json({
    _id,
    title: 'Credential Successfully Removed!',
  });
};
