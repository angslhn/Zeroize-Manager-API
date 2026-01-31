import database from '@/lib/database.js';
import * as UserService from '@/services/user.service.js';

import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  const payload = {
    username: req.body.username.trim(),
    password: req.body.password.trim(),
  };

  await database();

  await UserService.create(payload);

  res.status(201).json({
    title: 'Registration successful',
    message: 'Account creation registration successful, please login to continue.',
  });
};

export const login = async (req: Request, res: Response) => {
  const payload = {
    username: req.body.username.trim(),
    password: req.body.password.trim(),
  };

  await database();

  const authorization = await UserService.find(payload);

  res.status(200).json({
    title: 'Login successful',
    message:
      'Successfully logged into your account, now you can manage all your credentials on the dashboard.',
    authorization,
  });
};

export const setPassword = async (req: Request, res: Response) => {
  const dek = req.headers['x-vault-key'];

  const payload = {
    ...req.body,
    userId: req.user?.id,
    username: req.user?.username,
    dek,
    newPassword: req.body.newPassword.trim(),
  };

  await database();

  const newDek = await UserService.set(payload);

  res.status(200).json({
    title: 'Password Change Successful',
    message:
      "Your old password has been successfully updated to a new one, and its encryption security has changed. Make sure you save your new password so you don't forget it.",
    authorization: { dek: newDek },
  });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const payload = { ...req.body, userId: req.user?.id, username: req.user?.username };

  await database();

  await UserService.drop(payload);

  res.status(200).json({
    title: 'Account Delete Successful',
    message:
      'Your account has now been deleted on the server, and all your credential data has been securely deleted!',
  });
};
