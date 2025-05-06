import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// @ts-ignore - Global mongoose declaration
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to the MongoDB database
 */
async function connectDB() {
  if (cached.conn) {
    const readyState = cached.conn.connection.readyState;
    const stateNames = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    const stateName = stateNames[readyState as keyof typeof stateNames] || 'unknown';
    console.log(`MongoDB connection status: ${stateName} (${readyState})`);
    
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Connecting to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`MongoDB connected successfully! Database: ${mongoose.connection.name}`);
        
        // Set up connection event listeners for better monitoring
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected');
        });
        
        return mongoose;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

// For Next.js App Router, we can immediately start connecting
// This will be executed once during app initialization
const globalConnectPromise = connectDB().catch(console.error);

export { globalConnectPromise };
export default connectDB; 