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
      // Optimize connection pool for better performance
      maxPoolSize: 15, // Increased pool size
      minPoolSize: 5,  // Maintain minimum connections
      // Set read preference to primary preferred for better read performance
      readPreference: 'primaryPreferred',
      // Optimize timeouts for faster operations
      connectTimeoutMS: 8000,  // Connection timeout 8 seconds
      socketTimeoutMS: 30000,  // Socket timeout 30 seconds
      serverSelectionTimeoutMS: 8000, // Server selection timeout
      heartbeatFrequencyMS: 10000, // Heartbeat frequency
      // Enable compression for better network performance
      compressors: ['zlib'],
      // Optimize for faster writes
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 5000
      },
      // Add retry writes for better reliability
      retryWrites: true,
      retryReads: true,
      // Optimize for production
      maxIdleTimeMS: 30000,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully with optimized settings');
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
