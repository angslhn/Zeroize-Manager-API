import { Schema } from 'mongoose';

import type { Credential } from '@/@types/globals.js';

export const credentialSchema = new Schema<Credential>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
      index: true,
    },
    service: {
      type: String,
      required: [true, 'service is required'],
    },
    account: {
      type: String,
      required: [true, 'account is required'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
