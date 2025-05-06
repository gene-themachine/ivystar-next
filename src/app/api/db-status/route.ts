import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const mongooseInstance = await connectDB();
    
    // Check connection status
    const isConnected = mongooseInstance.connection.readyState === 1;
    
    return NextResponse.json({
      connected: isConnected,
      status: isConnected ? 'Connected' : 'Disconnected',
      details: {
        readyState: mongooseInstance.connection.readyState,
        host: mongooseInstance.connection.host,
        name: mongooseInstance.connection.name,
        models: Object.keys(mongoose.models)
      },
      message: isConnected 
        ? 'MongoDB connected successfully!' 
        : 'MongoDB is not connected'
    });
  } catch (error) {
    console.error('Failed to check MongoDB connection status:', error);
    return NextResponse.json({
      connected: false,
      status: 'Error',
      message: `Failed to connect to MongoDB: ${(error as Error).message}`,
      error: (error as Error).message
    }, { status: 500 });
  }
} 