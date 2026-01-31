import { Router } from 'express';

import { index } from '@/controllers/app.controller.js';

const appRoutes = Router();

appRoutes.get('/', index);

export default appRoutes;
