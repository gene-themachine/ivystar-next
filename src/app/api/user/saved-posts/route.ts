import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// GET user's saved posts
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to view saved posts' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the user document to get saved post IDs
    const userDoc = await User.findOne({ clerkId: user.id });
    
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found in the database' },
        { status: 404 }
      );
    }

    // Get the saved post IDs from the user document
    const savedPostIds = userDoc.savedPosts || [];
    
    // If no saved posts, return empty array
    if (savedPostIds.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    // Find all saved posts
    const posts = await Post.find({ _id: { $in: savedPostIds } }).sort({ createdAt: -1 });
    
    // Add isLiked and isSaved fields to each post
    const postsWithUserStatus = posts.map(post => {
      const postObj = post.toObject();
      
      // Check like and save status 
      const isLiked = post.likedBy.includes(user.id);
      const isSaved = true; // We know these are saved posts
      
      return {
        ...postObj,
        isLiked,
        isSaved,
        // Ensure likes and saves counts are accurate
        likes: post.likedBy.length,
        saves: post.savedBy?.length || 0
      };
    });
    
    return NextResponse.json({ posts: postsWithUserStatus });
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved posts' },
      { status: 500 }
    );
  }
} 