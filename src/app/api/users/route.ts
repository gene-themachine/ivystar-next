import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// Define an interface for the update object
interface UserUpdateData {
  username: string;
  email: string;
  role: string;
  interests: string[];
  profilePhoto?: string;
  backgroundPhoto?: string;
  bio?: string;
  projectPhoto?: string;
  projectDescription?: string;
  college?: string;
  gradeLevel?: string;
  isVerified?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Get user by clerkId
    const dbUser = await User.findOne({ clerkId: user.id });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user from MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const {
      clerkId,
      username,
      email,
      role,
      interests,
      profilePhoto,
      backgroundPhoto,
      bio,
      projectPhoto,
      projectDescription,
      college,
      gradeLevel,
      isVerified
    } = body;
    
    // Validate required fields
    if (!clerkId || !username || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields (clerkId, username, email, role)' },
        { status: 400 }
      );
    }
    
    // Ensure the authenticated user can only create/update their own record
    if (clerkUser.id !== clerkId) {
      return NextResponse.json(
        { error: 'Cannot create or update records for other users' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });
    
    if (existingUser) {
      // Log incoming data
      console.log('Updating user in MongoDB.');
      console.log('Existing user before update:', existingUser);
      
      // Create the update object with the proper interface
      const updateObject: UserUpdateData = {
        username,
        email,
        role,
        interests: interests || [],
        profilePhoto,
        backgroundPhoto,
        bio,
        projectPhoto,
        projectDescription,
        college,
        gradeLevel,
        isVerified
      };
      
      console.log('Update object being sent to MongoDB:', updateObject);
      
      // Update existing user with the explicit update object
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { $set: updateObject }, // Use $set operator to ensure all fields are updated properly
        { new: true }
      );
      
      console.log('User updated in MongoDB successfully');
      
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } else {
      // Log incoming data for new user
      console.log('Creating new user in MongoDB.');
      
      // Create user object with the proper interface
      const newUserData: UserUpdateData = {
        username,
        email,
        role,
        interests: interests || [],
        profilePhoto,
        backgroundPhoto,
        bio,
        projectPhoto,
        projectDescription,
        college,
        gradeLevel,
        isVerified
      };
      
      console.log('New user data being sent to MongoDB:', newUserData);
      
      // Create new user with the properly structured data
      const newUser = await User.create({
        clerkId,
        ...newUserData
      });
      
      console.log('New user created in MongoDB successfully');
      
      return NextResponse.json({ user: newUser }, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to save user data' },
      { status: 500 }
    );
  }
} 