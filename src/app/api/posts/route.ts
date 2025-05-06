import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { currentUser } from '@clerk/nextjs/server';

// GET all posts
export async function GET() {
  try {
    await connectDB();
    
    // Get all posts, sorted by most recent first
    const posts = await Post.find({}).sort({ createdAt: -1 });
    
    // Log some sample post info for debugging
    if (posts.length > 0) {
      console.log('Sample post author info:', {
        username: posts[0].author.username,
        institution: posts[0].author.institution,
        isVerified: posts[0].author.isVerified
      });
    }
    
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST a new post
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create a post' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, content, images, tags, community } = body;
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Create the post
    const newPost = await Post.create({
      title,
      content,
      author: {
        clerkId: user.id,
        username: user.unsafeMetadata?.username as string || user.username || user.firstName || 'Anonymous',
        profileImage: user.imageUrl,
        institution: user.unsafeMetadata?.college as string || user.unsafeMetadata?.institution as string || 'Unknown Institution',
        isVerified: user.unsafeMetadata?.isVerified as boolean || false,
      },
      images,
      tags: tags || [],
      community,
      likes: 0,
      comments: 0,
    });
    
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 