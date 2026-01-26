import mongoose from 'mongoose';
import { Env } from '@/config/env.js';

import type { ConnectOptions } from 'mongoose';
import type { MongooseCache } from '@/@types/globals.js';

declare global {
  var mongoose: MongooseCache;
}

if (!Env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside environment variables',
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export default async function database() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const connectOptions: ConnectOptions = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(Env.MONGODB_URI, connectOptions).then((mongoose) => {
      console.info('Database connection established');

      return mongoose;
    });
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;

    console.error('Database connection failed');

    throw error;
  }

  return cached.connection;
}
