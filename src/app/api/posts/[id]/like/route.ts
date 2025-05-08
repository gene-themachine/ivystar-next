import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// PUT request to toggle like status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to like posts' },
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

    // Check if user has already liked the post
    const userHasLiked = post.likedBy.includes(user.id);

    // Find the user document
    const userDoc = await User.findOne({ clerkId: user.id });
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found in the database' },
        { status: 404 }
      );
    }

    // Toggle like status
    if (userHasLiked) {
      // Remove user from post's likedBy array
      await Post.findByIdAndUpdate(postId, {
        $pull: { likedBy: user.id }
      });
      
      // Remove post from user's likedPosts array
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $pull: { likedPosts: postId } }
      );
    } else {
      // Add user to post's likedBy array
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likedBy: user.id }
      });
      
      // Add post to user's likedPosts array
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $addToSet: { likedPosts: postId } }
      );
    }

    // Get the updated post with the new like count
    const updatedPost = await Post.findById(postId);
    
    // For backward compatibility, update the likes count field
    await Post.findByIdAndUpdate(postId, {
      $set: { likes: updatedPost?.likedBy.length || 0 }
    });

    return NextResponse.json({ 
      success: true,
      liked: !userHasLiked,
      likeCount: updatedPost?.likedBy.length || 0
    });
  } catch (error) {
    console.error('Error toggling post like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle post like' },
      { status: 500 }
    );
  }
}

// GET request to check if a user has liked a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ liked: false, likeCount: 0 });
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

    // Check if user has liked the post
    const liked = post.likedBy.includes(user.id);
    const likeCount = post.likedBy.length;

    return NextResponse.json({ liked, likeCount });
  } catch (error) {
    console.error('Error checking post like status:', error);
    return NextResponse.json(
      { error: 'Failed to check post like status' },
      { status: 500 }
    );
  }
} 