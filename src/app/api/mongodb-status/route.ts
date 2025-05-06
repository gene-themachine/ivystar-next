import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // This will return the existing connection without creating a new one
    // since we've already initialized it at app startup
    const mongoose = await connectDB();
    
    return NextResponse.json(
      { 
        status: 'success', 
        message: 'MongoDB is connected!',
        connection: {
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name,
        }
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to MongoDB',
        error: (error as Error).message
      }, 
      { status: 500 }
    );
  }
} 