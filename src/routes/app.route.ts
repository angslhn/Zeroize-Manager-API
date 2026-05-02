import { Router } from 'express';

import { index } from '@/controllers/app.controller.js';

import userRoutes from './user.route.js';
import credentialRoutes from './credential.route.js';
import secretCodeRoutes from './secretcode.route.js';

import dek from '@/middlewares/data-encryption-key.js';
import authorization from '@/middlewares/authorization.js';

const appRoutes = Router();

appRoutes.get('/', index);
appRoutes.use('/api/users', userRoutes);
appRoutes.use('/api/secretcodes', authorization, dek, secretCodeRoutes);
appRoutes.use('/api/credentials', authorization, dek, credentialRoutes);

export default appRoutes;
