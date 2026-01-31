import database from '@/lib/database.js';

import * as SecretCodeService from '@/services/secretcode.service.js';

import type { Request, Response } from 'express';
import type { AuthPayload, SecretCodePayload, CredentialPayload } from '@/@types/globals.js';

export const findSecretCodes = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload: AuthPayload = { userId: req.user?.id as string, dek: dek as string };

  await database();

  const result = await SecretCodeService.find(payload);

  res.status(200).json({
    data: {
      secret_codes: result,
    },
  });
};

export const addSecretCode = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload: SecretCodePayload = {
    ...req.body,
    userId: req.user?.id,
    dek,
    name: req.body.name.trim(),
    code: req.body.code.trim(),
  };

  await database();

  const result = await SecretCodeService.add(payload);

  res.status(201).json({
    data: {
      secret_code: result,
    },
    title: 'Code Successfully Added!',
  });
};

export const editSecretCode = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload: SecretCodePayload = {
    ...req.body,
    userId: req.user?.id,
    dek,
    _id: req.body._id.trim(),
    user: req.body.user.trim(),
    name: req.body.name.trim(),
    code: req.body.code.trim(),
  };

  await database();

  const result = await SecretCodeService.findAndEdit(payload);

  res.status(200).json({
    data: {
      secret_code: result,
    },
    title: 'Code Changed Successfully!',
  });
};

export const removeSecretCode = async (req: Request, res: Response) => {
  const payload: Pick<CredentialPayload, 'userId' | '_id'> = {
    userId: req.user?.id,
    ...req.body,
  };

  await database();

  const _id = await SecretCodeService.findAndRemove(payload);

  res.status(200).json({
    _id,
    title: 'Code Successfully Removed!',
  });
};
