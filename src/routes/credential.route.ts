import { Router } from 'express';

import noCache from '@/middlewares/no-cache.js';

import {
  addCredential,
  removeCredential,
  editCredential,
  findCredentials,
} from '@/controllers/credential.controller.js';
import validation from '@/middlewares/credential-validation.js';

const credentialRoutes = Router();

credentialRoutes.get('/', noCache, findCredentials);
credentialRoutes.post('/add', validation, addCredential);
credentialRoutes.put('/edit', validation, editCredential);
credentialRoutes.delete('/remove', removeCredential);

export default credentialRoutes;
