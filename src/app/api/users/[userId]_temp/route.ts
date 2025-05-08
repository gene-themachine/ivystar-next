import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

interface UserDocument {
  _id: any;
  clerkId?: string;
  username?: string;
  profilePhoto?: string;
  bio?: string;
  [key: string]: any;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await currentUser();
    
    // Optional: Check if the user is authenticated
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Connect to the database
    await connectDB();
    
    // Try to find the user by clerkId (for Clerk users)
    let userData = await User.findOne({ clerkId: userId }).lean() as UserDocument | null;
    
    // If not found, try to find by MongoDB _id
    if (!userData) {
      try {
        userData = await User.findById(userId).lean() as UserDocument | null;
      } catch (error) {
        console.error('Error finding user by ID:', error);
      }
    }
    
    // If still not found, return 404
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return the user data
    return NextResponse.json({
      id: userData._id.toString(),
      clerkId: userData.clerkId || null,
      username: userData.username || 'Unknown User',
      profilePhoto: userData.profilePhoto || null,
      bio: userData.bio || null
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Error fetching user data' },
      { status: 500 }
    );
  }
} 