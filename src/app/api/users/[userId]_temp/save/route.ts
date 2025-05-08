import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// PUT request to toggle save status for a mentor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    // Ensure params is properly handled
    const mentorClerkId = userId;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to save mentors' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find both mentor and current user
    if (!mentorClerkId) {
      return NextResponse.json(
        { error: 'Mentor ID is required' },
        { status: 400 }
      );
    }

    // Find the mentor by clerkId
    const mentor = await User.findOne({ clerkId: mentorClerkId });
    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    // Find the current user
    const currentUserDoc = await User.findOne({ clerkId: user.id });
    if (!currentUserDoc) {
      return NextResponse.json(
        { error: 'User not found in the database' },
        { status: 404 }
      );
    }

    // Check if user has already saved the mentor
    const userHasSaved = currentUserDoc.savedMentors?.includes(mentorClerkId);

    // Toggle save status
    if (userHasSaved) {
      // Remove mentor from user's savedMentors array
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $pull: { savedMentors: mentorClerkId } }
      );
    } else {
      // Add mentor to user's savedMentors array
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $addToSet: { savedMentors: mentorClerkId } }
      );
    }

    // Get the updated user doc to confirm the save status
    const updatedUser = await User.findOne({ clerkId: user.id });
    const saved = updatedUser.savedMentors?.includes(mentorClerkId) || false;

    return NextResponse.json({ 
      success: true,
      saved
    });
  } catch (error) {
    console.error('Error toggling mentor save:', error);
    return NextResponse.json(
      { error: 'Failed to toggle mentor save' },
      { status: 500 }
    );
  }
}

// GET request to check if a user has saved a mentor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    // Ensure params is properly handled
    const mentorClerkId = userId;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ saved: false });
    }

    await connectDB();

    // Find the mentor by clerkId
    if (!mentorClerkId) {
      return NextResponse.json(
        { error: 'Mentor ID is required' },
        { status: 400 }
      );
    }
    
    // Find the current user
    const currentUserDoc = await User.findOne({ clerkId: user.id });
    if (!currentUserDoc) {
      return NextResponse.json({ saved: false });
    }

    // Check if user has saved the mentor
    const saved = currentUserDoc.savedMentors?.includes(mentorClerkId) || false;

    return NextResponse.json({ saved });
  } catch (error) {
    console.error('Error checking mentor save status:', error);
    return NextResponse.json(
      { error: 'Failed to check mentor save status' },
      { status: 500 }
    );
  }
} 