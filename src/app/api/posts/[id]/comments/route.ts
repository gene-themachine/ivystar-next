import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { currentUser } from '@clerk/nextjs/server';

// GET comments for a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Verify the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Fetch comments for this post
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
        role: comment.author.role,
        timeAgo,
        createdAt: comment.createdAt
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

// POST a new comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to comment' },
        { status: 401 }
      );
    }
    
    const { id: postId } = await params;
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { content } = body;
    
    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Verify the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Get the profile image with correct priority
    const profileImage = user.unsafeMetadata?.profilePhoto as string || user.imageUrl || '/images/default-profile.png';
    
    // Get user role from metadata
    const userRole = (user.unsafeMetadata?.role as 'mentor' | 'student') || 'student';
    
    // Create the comment
    const newComment = await Comment.create({
      content,
      author: {
        clerkId: user.id,
        username: user.unsafeMetadata?.username as string || user.username || user.firstName || 'Anonymous',
        profileImage: profileImage,
        institution: user.unsafeMetadata?.college as string || user.unsafeMetadata?.institution as string || 'Unknown Institution',
        isVerified: user.unsafeMetadata?.isVerified as boolean || false,
        role: userRole,
      },
      postId
    });
    
    // Update the comments count on the post
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });
    
    // Format the new comment with timeAgo for consistency with GET
    const now = new Date();
    const createdAt = new Date(newComment.createdAt);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    let timeAgo = "Just now";
    
    const formattedComment = {
      id: newComment._id,
      author: newComment.author.username,
      profileImage: newComment.author.profileImage,
      content: newComment.content,
      isVerified: newComment.author.isVerified,
      institution: newComment.author.institution,
      role: newComment.author.role,
      timeAgo,
      createdAt: newComment.createdAt
    };
    
    return NextResponse.json({ comment: formattedComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
