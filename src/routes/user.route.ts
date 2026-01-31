import { Router } from 'express';

import dek from '@/middlewares/data-encryption-key.js';
import authorization from '@/middlewares/authorization.js';
import validation from '@/middlewares/user-validation.js';

import * as User from '@/validators/user.validator.js';

import { setPassword, deleteAccount, login, register } from '@/controllers/user.controller.js';

const userRoutes = Router();

userRoutes.post('/login', validation(User.login), login);
userRoutes.post('/register', validation(User.register), register);
userRoutes.patch('/set-password', authorization, dek, validation(User.setPassword), setPassword);
userRoutes.delete('/delete', authorization, validation(User.deleteAccount), deleteAccount);

export default userRoutes;
