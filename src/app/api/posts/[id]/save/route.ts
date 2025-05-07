import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// PUT request to toggle save status
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Ensure params is properly handled as a Promise
    const { params } = context;
    const postId = String(params.id);

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to save posts' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the post by ID
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user has already saved the post
    const userHasSaved = post.savedBy.includes(user.id);

    // Find the user document
    const userDoc = await User.findOne({ clerkId: user.id });
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found in the database' },
        { status: 404 }
      );
    }

    // Toggle save status
    if (userHasSaved) {
      // Remove user from post's savedBy array
      await Post.findByIdAndUpdate(postId, {
        $pull: { savedBy: user.id }
      });
      
      // Remove post from user's savedPosts array
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $pull: { savedPosts: postId } }
      );
    } else {
      // Add user to post's savedBy array
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { savedBy: user.id }
      });
      
      // Add post to user's savedPosts array
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $addToSet: { savedPosts: postId } }
      );
    }

    // Get the updated post with the new save count
    const updatedPost = await Post.findById(postId);
    
    // For backward compatibility, update the saves count field
    await Post.findByIdAndUpdate(postId, {
      $set: { saves: updatedPost?.savedBy.length || 0 }
    });

    return NextResponse.json({ 
      success: true,
      saved: !userHasSaved,
      saveCount: updatedPost?.savedBy.length || 0
    });
  } catch (error) {
    console.error('Error toggling post save:', error);
    return NextResponse.json(
      { error: 'Failed to toggle post save' },
      { status: 500 }
    );
  }
}

// GET request to check if a user has saved a post
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Ensure params is properly handled as a Promise
    const { params } = context;
    const postId = String(params.id);

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ saved: false, saveCount: 0 });
    }

    await connectDB();

    // Find the post by ID
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user has saved the post
    const saved = post.savedBy.includes(user.id);
    const saveCount = post.savedBy.length;

    return NextResponse.json({ saved, saveCount });
  } catch (error) {
    console.error('Error checking post save status:', error);
    return NextResponse.json(
      { error: 'Failed to check post save status' },
      { status: 500 }
    );
  }
} 