import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// GET request to fetch a post by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Ensure params is properly handled as a Promise
    const { params } = context;
    const postId = String(params.id);
    
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
    
    // Add user-specific information if user is logged in
    if (user) {
      // Check if user has liked/saved the post
      postObj.isLiked = post.likedBy.includes(user.id);
      postObj.isSaved = post.savedBy?.includes(user.id) || false;
      
      // Add mock comments (these would come from a Comments collection in a real app)
      postObj.commentsList = generateMockComments(postId);
    } else {
      postObj.isLiked = false;
      postObj.isSaved = false;
      postObj.commentsList = generateMockComments(postId);
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

// Helper function to generate mock comments
function generateMockComments(postId: string) {
  // Generate some mock comments for the post
  return [
    {
      id: `comment-1-${postId}`,
      author: 'Alex Johnson',
      profileImage: 'https://i.pravatar.cc/150?img=1',
      content: 'This is such a helpful post. Thanks for sharing your insights!',
      isVerified: true,
      institution: 'Harvard University',
      timeAgo: '2 hours ago',
      likes: 5,
      isLiked: false,
    },
    {
      id: `comment-2-${postId}`,
      author: 'Sam Rodriguez',
      profileImage: 'https://i.pravatar.cc/150?img=2',
      content: 'I disagree with some points here. In my experience, the approach described in paragraph 2 is not always optimal.',
      isVerified: false,
      institution: 'Stanford University',
      timeAgo: '4 hours ago',
      likes: 3,
      isLiked: false,
    },
    {
      id: `comment-3-${postId}`,
      author: 'Morgan Chen',
      profileImage: 'https://i.pravatar.cc/150?img=3',
      content: 'Has anyone tried applying these ideas to a different context? I wonder if they would work as well.',
      isVerified: false,
      institution: 'MIT',
      timeAgo: '1 day ago',
      likes: 7,
      isLiked: false,
    },
    {
      id: `comment-4-${postId}`,
      author: 'Taylor Smith',
      profileImage: 'https://i.pravatar.cc/150?img=4',
      content: 'Great post! I especially appreciate the practical examples you included.',
      isVerified: true,
      institution: 'Yale University',
      timeAgo: '2 days ago',
      likes: 12,
      isLiked: false,
    },
  ];
} 