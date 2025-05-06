import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

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
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        {
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
        },
        { new: true }
      );
      
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } else {
      // Create new user
      const newUser = await User.create({
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
      });
      
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