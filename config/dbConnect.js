import 'dotenv/config';
import mongoose from 'mongoose';

let connectionPromise;

export const dbConnect = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  const conn = await connectionPromise;
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};
