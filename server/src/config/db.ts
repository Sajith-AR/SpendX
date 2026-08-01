import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[MongoDB] Connected to external database: ${mongoose.connection.host}`);
      return uri;
    } catch (err: any) {
      console.warn(`[MongoDB] Could not connect to MONGODB_URI (${err.message}). Falling back to MongoMemoryServer...`);
    }
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to MongoMemoryServer (In-Memory DB): ${memoryUri}`);
    return memoryUri;
  } catch (err: any) {
    console.error(`[MongoDB] Failed to start MongoMemoryServer:`, err);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
