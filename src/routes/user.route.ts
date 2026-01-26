import { Router } from 'express';

import authorization from '@/middlewares/authorization.js';
import dek from '@/middlewares/data-encryption-key.js';
import validation from '@/middlewares/user-validation.js';

import * as User from '@/validators/user.validation.js';

import { changePassword, deleteAccount, login, register } from '@/controllers/user.controller.js';

const userRoutes = Router();

userRoutes.post('/login', validation(User.login), login);
userRoutes.post('/register', validation(User.register), register);
userRoutes.patch(
  '/change-password',
  authorization,
  dek,
  validation(User.changePassword),
  changePassword,
);
userRoutes.delete('/delete', authorization, validation(User.deleteAccount), deleteAccount);

export default userRoutes;
