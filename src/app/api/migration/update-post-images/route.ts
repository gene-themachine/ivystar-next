import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// This is an admin-only endpoint that updates all posts with the correct profile images
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Simple admin check
    const isAdmin = user.privateMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Get all users to build a mapping
    const users = await User.find({});
    
    // Create a map of clerkId -> profilePhoto
    const userProfileMap: Record<string, string> = {};
    users.forEach(user => {
      if (user.clerkId && user.profilePhoto) {
        userProfileMap[user.clerkId] = user.profilePhoto;
      }
    });
    
    console.log(`Found ${Object.keys(userProfileMap).length} users with profile photos`);
    
    // Get all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts to update`);
    
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
        const clerkId = post.author.clerkId;
        const profilePhoto = userProfileMap[clerkId];
        
        // Skip if we don't have a profile photo for this user
        if (!profilePhoto) {
          console.log(`No profile photo found for user ${clerkId}, skipping post ${post._id}`);
          results.skipped++;
          continue;
        }
        
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
      message: 'Migration completed',
      results
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed' },
      { status: 500 }
    );
  }
} 