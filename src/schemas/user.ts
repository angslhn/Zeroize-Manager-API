import { Schema } from 'mongoose';

import type { UserDocument } from '@/@types/globals.js';

export const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [32, 'Username maximum 32 characters'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Username is required'],
      minLength: [3, 'Username must be at least 3 characters'],
    },
    metadata: {
      key: { type: String, required: true },
      salt: { type: String, required: true },
      iv: { type: String, required: true },
      auth_tag: { type: String, required: true },
    },
  },
  { timestamps: true, versionKey: false },
);
