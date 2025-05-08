import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import Comment from '@/models/Comment';
import { currentUser } from '@clerk/nextjs/server';

// GET request to fetch all comments for a post
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: postId } = context.params;
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find comments for this post
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    
    // Transform to client-friendly format
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
        likes: 0 // We're not implementing comment likes as requested
      };
    });
    
    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST request to add a comment to a post
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: postId } = context.params;
    
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to comment' },
        { status: 401 }
      );
    }
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const { content } = await request.json();
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the post to make sure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Get user profile information
    const profileImage = user.unsafeMetadata?.profilePhoto as string || user.imageUrl || '/images/default-profile.png';
    const userRole = (user.unsafeMetadata?.role as 'mentor' | 'student') || 'student';
    
    // Create the new comment
    const newComment = await Comment.create({
      content,
      author: {
        clerkId: user.id,
        username: user.unsafeMetadata?.username as string || user.username || user.firstName || 'Anonymous',
        profileImage,
        institution: user.unsafeMetadata?.college as string || user.unsafeMetadata?.institution as string || 'Unknown Institution',
        isVerified: user.unsafeMetadata?.isVerified as boolean || false,
        role: userRole,
      },
      postId,
    });
    
    // Increment comment count on the post
    post.comments += 1;
    await post.save();
    
    // Format the comment for response
    const createdAt = new Date(newComment.createdAt);
    
    const formattedComment = {
      id: newComment._id,
      author: newComment.author.username,
      profileImage: newComment.author.profileImage,
      content: newComment.content,
      isVerified: newComment.author.isVerified,
      institution: newComment.author.institution,
      timeAgo: 'Just now',
      likes: 0
    };
    
    return NextResponse.json({ 
      success: true, 
      comment: formattedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
} 