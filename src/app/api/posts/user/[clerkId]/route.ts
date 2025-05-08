import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// GET /api/posts/user/[clerkId]
export async function GET(
  _request: NextRequest,
  { params }: { params: { clerkId: string } }
) {
  try {
    const { clerkId } = params;

    if (!clerkId) {
      return NextResponse.json(
        { error: 'clerkId parameter is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the posts authored by this clerkId, newest first
    const posts = await Post.find({ 'author.clerkId': clerkId }).sort({ createdAt: -1 });

    // Determine if the current session user has liked or saved these posts so that the
    // same Post component can be reused on the client.
    const sessionUser = await currentUser();
    if (sessionUser) {
      // Ensure the user document exists so we can determine like/save status consistently
      await User.findOneAndUpdate(
        { clerkId: sessionUser.id },
        { $setOnInsert: { clerkId: sessionUser.id } },
        { upsert: true }
      );
    }

    const postsWithStatus = posts.map((post) => {
      const postObj = post.toObject();
      const postId = post._id.toString();

      const isLiked = sessionUser ? post.likedBy.includes(sessionUser.id) : false;
      const isSaved = sessionUser ? post.savedBy?.includes(sessionUser.id) : false;

      return {
        ...postObj,
        isLiked,
        isSaved,
        likes: post.likedBy.length,
        saves: post.savedBy?.length || 0,
      };
    });

    return NextResponse.json({ posts: postsWithStatus }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
} 