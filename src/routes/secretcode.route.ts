import { Router } from 'express';

import noCache from '@/middlewares/no-cache.js';
import validation from '@/middlewares/secretcode-validation.js';

import {
  addSecretCode,
  removeSecretCode,
  editSecretCode,
  findSecretCodes,
} from '@/controllers/secretcode.controller.js';

const secretCodeRoutes = Router();

secretCodeRoutes.get('/', noCache, findSecretCodes);
secretCodeRoutes.post('/add', validation, addSecretCode);
secretCodeRoutes.put('/edit', validation, editSecretCode);
secretCodeRoutes.delete('/remove', removeSecretCode);

export default secretCodeRoutes;
