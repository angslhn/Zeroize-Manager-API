import { Schema } from 'mongoose';

import type { SecretCode } from '@/@types/globals.js';

export const secretCodeSchema = new Schema<SecretCode>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'account is required'],
    },
    code: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
