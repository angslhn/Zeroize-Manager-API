import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import database from '@/lib/database.js';

import { Env } from './config/env.js';

import globalError from './middlewares/global-error.js';
import authorization from './middlewares/authorization.js';
import unknownRoute from './middlewares/unknown-route.js';

import appRoutes from './routes/app.route.js';
import userRoutes from './routes/user.route.js';
import credentialRoutes from './routes/credential.route.js';

import type { CorsOptions } from 'cors';
import type { Request, Response } from 'express';

const app = express();

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      title: 'Too Many Requests',
      message: 'Too many requests from this IP, please try again after 15 minutes!',
    });
  },
});

const corsOptions: CorsOptions = {
  origin: Env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Vault-Key'],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

database();

app.use(appRoutes);
app.use('/api/users', userRoutes);
app.use('/api/credentials', authorization, credentialRoutes);
app.use(unknownRoute);
app.use(globalError);

if (!process.env.VERCEL) {
  app.listen(Env.PORT, () => console.info('The server is running successfully'));
}

export default app;
