import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// This endpoint updates the current user's posts with their correct profile image
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const clerkId = user.id;
    await connectDB();
    
    // Get the user's profile photo from MongoDB
    const dbUser = await User.findOne({ clerkId });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    
    // Get the correct profile photo
    // Priority: MongoDB profilePhoto > Clerk unsafeMetadata.profilePhoto > Clerk imageUrl
    const profilePhoto = 
      dbUser.profilePhoto || 
      (user.unsafeMetadata?.profilePhoto as string) || 
      user.imageUrl;
    
    if (!profilePhoto) {
      return NextResponse.json(
        { error: 'No profile photo found for user' },
        { status: 404 }
      );
    }
    
    console.log(`Found profile photo for user ${clerkId}:`, profilePhoto);
    
    // Get all posts by this user
    const posts = await Post.find({ 'author.clerkId': clerkId });
    console.log(`Found ${posts.length} posts by user ${clerkId}`);
    
    // Track results
    const results = {
      total: posts.length,
      updated: 0,
      skipped: 0,
      errors: 0
    };
    
    // Update each post
    for (const post of posts) {
      try {
        // Only update if the profile image is different
        if (post.author.profileImage !== profilePhoto) {
          console.log(`Updating post ${post._id} with profile photo ${profilePhoto}`);
          
          post.author.profileImage = profilePhoto;
          await post.save();
          
          results.updated++;
        } else {
          console.log(`Post ${post._id} already has the correct profile image`);
          results.skipped++;
        }
      } catch (error) {
        console.error(`Error updating post ${post._id}:`, error);
        results.errors++;
      }
    }
    
    return NextResponse.json({ 
      message: 'Posts updated successfully',
      profilePhoto,
      results
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update posts' },
      { status: 500 }
    );
  }
} 