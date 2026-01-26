import { Router } from 'express';
import dek from '@/middlewares/data-encryption-key.js';
import noCache from '@/middlewares/no-cache.js';

import {
  addCredential,
  deleteCredential,
  editCredential,
  findCredentials,
} from '@/controllers/credential.controller.js';
import validation from '@/middlewares/credential-validation.js';

const credentialRoutes = Router();

credentialRoutes.get('/', dek, noCache, findCredentials);
credentialRoutes.post('/add', dek, validation, addCredential);
credentialRoutes.put('/edit', dek, validation, editCredential);
credentialRoutes.delete('/delete', dek, deleteCredential);

export default credentialRoutes;
