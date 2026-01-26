import type { TokenPayload } from './globals.ts';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
