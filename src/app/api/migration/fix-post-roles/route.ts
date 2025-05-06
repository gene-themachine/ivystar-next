import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// This endpoint updates posts with missing role info and links them to users
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Get all users to build a user info mapping
    const users = await User.find({});
    console.log(`Found ${users.length} users to process role information`);
    
    // Create a map of clerkId -> user info
    const userInfoMap: Record<string, {role: string, profilePhoto: string, username: string}> = {};
    users.forEach(user => {
      if (user.clerkId) {
        userInfoMap[user.clerkId] = {
          role: user.role || 'student',
          profilePhoto: user.profilePhoto || '',
          username: user.username || ''
        };
      }
    });
    
    // Get all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts to update with roles and link to users`);
    
    // Track results
    const results = {
      total: posts.length,
      updated: 0,
      linked: 0,
      skipped: 0,
      errors: 0
    };
    
    // Update each post and link to user
    for (const post of posts) {
      try {
        const clerkId = post.author.clerkId;
        const userInfo = userInfoMap[clerkId];
        
        let wasUpdated = false;
        
        // Skip if we don't have user info for this post
        if (!userInfo) {
          console.log(`No user info found for post ${post._id} by author ${clerkId}, skipping`);
          results.skipped++;
          continue;
        }
        
        // Add role if missing
        if (!post.author.role && userInfo.role) {
          post.author.role = userInfo.role;
          wasUpdated = true;
        }
        
        // Add/update profile image if needed
        if (userInfo.profilePhoto && (!post.author.profileImage || post.author.profileImage === '/images/default-profile.png')) {
          post.author.profileImage = userInfo.profilePhoto;
          wasUpdated = true;
        }
        
        // Save post if updates were made
        if (wasUpdated) {
          await post.save();
          results.updated++;
          console.log(`Updated post ${post._id} with role: ${post.author.role}`);
        }
        
        // Now link this post to the user
        const userUpdateResult = await User.updateOne(
          { clerkId },
          { $addToSet: { posts: post._id.toString() } }
        );
        
        if (userUpdateResult.modifiedCount > 0) {
          results.linked++;
          console.log(`Linked post ${post._id} to user ${clerkId}`);
        }
        
      } catch (error) {
        console.error(`Error processing post ${post._id}:`, error);
        results.errors++;
      }
    }
    
    // Return summary of what was done
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