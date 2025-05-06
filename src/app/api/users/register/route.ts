import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectDB();
    
    // Get the current user from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Default values
    const DEFAULT_BIO = "I'm a member of the Ivystar community passionate about education and collaboration.";
    const DEFAULT_HOURLY_RATE = 50;
    
    // Set default values in Clerk if they don't exist
    const currentMetadata = clerkUser.unsafeMetadata as any || {};
    
    // We don't update Clerk metadata here directly since we need to use the user.update()
    // method which isn't available in the server component
    
    // Check if user already exists in MongoDB
    let user = await User.findOne({ clerkId: userId });
    
    if (user) {
      // Update existing user with defaults if not already set
      if (!user.bio || !user.hourlyRate) {
        user = await User.findOneAndUpdate(
          { clerkId: userId },
          { 
            $set: { 
              bio: user.bio || DEFAULT_BIO,
              hourlyRate: user.hourlyRate || DEFAULT_HOURLY_RATE
            } 
          },
          { new: true }
        );
        console.log(`Updated existing MongoDB user ${userId} with defaults`);
      }
    } else {
      // Create new user with defaults
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const username = clerkUser.username || 
                      (clerkUser.unsafeMetadata as any)?.username || 
                      email?.split('@')[0] || 
                      `user-${Date.now()}`;
      
      user = await User.create({
        clerkId: userId,
        username: username,
        email: email,
        role: (clerkUser.unsafeMetadata as any)?.role || 'student',
        bio: DEFAULT_BIO,
        hourlyRate: DEFAULT_HOURLY_RATE,
        interests: (clerkUser.unsafeMetadata as any)?.interests || [],
        profilePhoto: clerkUser.imageUrl,
        college: (clerkUser.unsafeMetadata as any)?.college || '',
        gradeLevel: (clerkUser.unsafeMetadata as any)?.gradeLevel || '',
      });
      
      console.log(`Created new MongoDB user ${userId} with defaults`);
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        username: user.username,
        bio: user.bio,
        hourlyRate: user.hourlyRate
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { error: 'Failed to register/update user' },
      { status: 500 }
    );
  }
} 