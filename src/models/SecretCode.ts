import { model } from 'mongoose';
import { secretCodeSchema } from '@/schemas/secretcode.js';

import type { SecretCode } from '@/@types/globals.js';

export const SecretCodeModel = model<SecretCode>('Code', secretCodeSchema);
