import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import Comment from '@/models/Comment';
import { currentUser } from '@clerk/nextjs/server';

// GET request to fetch a post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get ID directly from context.params
    const { id: postId } = await params;
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Get current user for checking saved/liked status
    const user = await currentUser();
    
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Convert to object for easier manipulation
    const postObj = post.toObject();
    
    // Fetch real comments for this post
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    
    // Transform comments to client-friendly format
    const formattedComments = comments.map(comment => {
      const createdAt = new Date(comment.createdAt);
      const now = new Date();
      
      // Calculate time ago
      const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
      let timeAgo;
      
      if (diffInSeconds < 60) {
        timeAgo = `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
      } else if (diffInSeconds < 86400) {
        timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
      } else {
        timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;
      }
      
      return {
        id: comment._id,
        author: comment.author.username,
        profileImage: comment.author.profileImage,
        content: comment.content,
        isVerified: comment.author.isVerified,
        institution: comment.author.institution,
        timeAgo,
        likes: 0, // Not implementing comment likes
        isLiked: false // Not implementing comment likes
      };
    });
    
    // Add user-specific information if user is logged in
    if (user) {
      // Check if user has liked/saved the post
      postObj.isLiked = post.likedBy.includes(user.id);
      postObj.isSaved = post.savedBy?.includes(user.id) || false;
      postObj.commentsList = formattedComments;
    } else {
      postObj.isLiked = false;
      postObj.isSaved = false;
      postObj.commentsList = formattedComments;
    }
    
    return NextResponse.json({ post: postObj });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
} 