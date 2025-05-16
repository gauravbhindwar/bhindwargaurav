import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env.local file');
}

// Global connection object
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If the connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Set connection pool size for better performance
      maxPoolSize: 10,
      // Set read preference to primary preferred for better read performance
      readPreference: 'primaryPreferred',
      // Add additional options for performance
      connectTimeoutMS: 10000, // Connection timeout 10 seconds
      socketTimeoutMS: 45000, // Socket timeout 45 seconds
    };

    // Connect to MongoDB
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Add additional utility for optimized queries
connectToDatabase.model = (name, schema) => {
  // Connect first to ensure schemas are registered properly
  connectToDatabase();
  return mongoose.models[name] || mongoose.model(name, schema);
};

export default connectToDatabase;
