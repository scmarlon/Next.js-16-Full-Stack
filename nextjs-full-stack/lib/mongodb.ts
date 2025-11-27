import mongoose from 'mongoose';

// Define the type for our cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose cache
declare global {
  /// eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Initialize the cached connection object
// In development, use a global variable to preserve the connection across hot reloads
// In production, the connection will be created fresh on each cold start
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * 
 * This function implements connection caching to prevent multiple connections
 * during development hot reloads and to reuse connections across serverless
 * function invocations.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose instance with an active connection
 */
async function connectDB(): Promise<typeof mongoose> {
  // If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is currently being established, wait for it
  if (!cached.promise) {
    //Validate MongoDB URI exists 
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    const opts = {
      bufferCommands: false, // Disable command buffering for better error handling
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise so we can retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
