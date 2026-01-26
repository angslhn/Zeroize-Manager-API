import { model } from 'mongoose';
import { credentialSchema } from '@/schemas/credential.js';

import type { Credential } from '@/@types/globals.js';

export const CredentialModel = model<Credential>('Credential', credentialSchema);
