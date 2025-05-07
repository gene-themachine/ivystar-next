import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Define a type for the user document with savedMentors
interface UserWithSavedMentors {
  savedMentors?: string[];
  [key: string]: any; // Allow other properties
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to view saved mentors' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Find the current user in database
    const userDoc = await User.findOne({ clerkId: user.id }).lean();
    
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    
    // Safely access savedMentors property with type casting
    const typedUserDoc = userDoc as UserWithSavedMentors;
    const savedMentorIds = typedUserDoc.savedMentors || [];
    
    // If no saved mentors, return empty array
    if (savedMentorIds.length === 0) {
      return NextResponse.json({ mentors: [] });
    }
    
    // Fetch all saved mentors using their clerkIds
    const savedMentors = await User.find({
      clerkId: { $in: savedMentorIds }
    }).select('clerkId username college profilePhoto bio hourlyRate interests isVerified projects').lean();
    
    // Format the response
    const formattedMentors = savedMentors.map(mentor => {
      const typedMentor = mentor as Record<string, any>;
      return {
        _id: typedMentor._id,
        clerkId: typedMentor.clerkId,
        username: typedMentor.username,
        school: typedMentor.college || 'University',
        hourlyRate: typedMentor.hourlyRate || 50,
        profileImage: typedMentor.profilePhoto || '/images/default-profile.png',
        bio: typedMentor.bio || 'Mentor at Ivystar',
        tags: typedMentor.interests || [],
        isVerified: typedMentor.isVerified || false,
        projects: typedMentor.projects || []
      };
    });
    
    return NextResponse.json({ mentors: formattedMentors });
  } catch (error) {
    console.error('Error fetching saved mentors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved mentors' },
      { status: 500 }
    );
  }
} 