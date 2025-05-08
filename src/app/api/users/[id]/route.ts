import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users/:id  -> returns public user info for given clerkId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clerkId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    // Fetch limited public fields
    const user = await User.findOne({ clerkId }).select('username profilePhoto isVerified role');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
      profilePhoto: user.profilePhoto || '/images/default-profile.png',
      isVerified: user.isVerified || false,
      role: user.role || 'student',
    });
  } catch (error) {
    console.error('Error fetching public user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
} 