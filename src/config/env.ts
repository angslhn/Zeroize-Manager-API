import dotenvFlow from 'dotenv-flow';

import type { StringValue } from 'ms';
import type { EnvOption } from '@/@types/globals.js';

dotenvFlow.config({ silent: true });

export const Env: EnvOption = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV as string,
  ORIGIN: process.env.ORIGIN as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as StringValue,
  MONGODB_URI: process.env.MONGODB_URI as string,
};
