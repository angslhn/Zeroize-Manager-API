import { index } from '@/controllers/app.controller.js';
import { Router } from 'express';

const appRoutes = Router();

appRoutes.get('/', index);

export default appRoutes;
