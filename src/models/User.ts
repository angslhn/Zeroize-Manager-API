import { model } from 'mongoose';
import { userSchema } from '@/schemas/user.js';

import type { UserDocument } from '@/@types/globals.js';

export const UserModel = model<UserDocument>('User', userSchema);
