import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// GET all posts
export async function GET() {
  try {
    await connectDB();
    
    // Get all posts, sorted by most recent first
    const posts = await Post.find({}).sort({ createdAt: -1 });
    
    // Log more detailed post info for debugging
    if (posts.length > 0) {
      // Log ALL posts author profileImage for debugging
      posts.forEach((post, index) => {
        console.log(`Post ${index} (${post._id}) author profile image:`, 
          post.author.profileImage,
          `Author: ${post.author.username}`,
          `Role: ${post.author.role || 'not set'}`
        );
      });
      
      console.log('Sample post author info:', {
        username: posts[0].author.username,
        institution: posts[0].author.institution,
        isVerified: posts[0].author.isVerified,
        profileImage: posts[0].author.profileImage,
        role: posts[0].author.role
      });
      
      // Check if there are any posts with missing profile images
      const missingProfileImages = posts.filter(post => !post.author.profileImage);
      if (missingProfileImages.length > 0) {
        console.warn(`${missingProfileImages.length} posts have missing profile images`);
      }
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
    
    // Get the profile image with correct priority
    // First try the custom uploaded image from unsafeMetadata, then fall back to Clerk's default
    const profileImage = user.unsafeMetadata?.profilePhoto as string || user.imageUrl || '/images/default-profile.png';
    
    // Get user role from metadata
    const userRole = (user.unsafeMetadata?.role as 'mentor' | 'student') || 'student';
    
    // Log user information for debugging
    console.log('User data when creating post:', {
      customProfilePhoto: user.unsafeMetadata?.profilePhoto,
      clerkImageUrl: user.imageUrl,
      finalProfileImage: profileImage,
      role: userRole,
      primaryEmail: user.primaryEmailAddress?.emailAddress
    });
    
    await connectDB();
    
    // Create the post
    const newPost = await Post.create({
      title,
      content,
      author: {
        clerkId: user.id,
        username: user.unsafeMetadata?.username as string || user.username || user.firstName || 'Anonymous',
        profileImage: profileImage, // Use the prioritized image
        institution: user.unsafeMetadata?.college as string || user.unsafeMetadata?.institution as string || 'Unknown Institution',
        isVerified: user.unsafeMetadata?.isVerified as boolean || false,
        role: userRole, // Add the user's role
      },
      images,
      tags: tags || [],
      community,
      likes: 0,
      comments: 0,
    });
    
    // Log the created post for debugging
    console.log('Created post with author:', newPost.author);
    
    // Link post to user in MongoDB
    try {
      // Find user and update their posts array
      const dbUser = await User.findOneAndUpdate(
        { clerkId: user.id },
        { 
          $addToSet: { posts: newPost._id.toString() }, // Use addToSet to avoid duplicates
          // Also ensure role is set in user document
          $set: { 
            role: userRole,
            // Update other potential missing fields
            profilePhoto: profileImage || user.imageUrl || undefined,
            username: user.unsafeMetadata?.username as string || user.username || user.firstName || undefined
          }
        },
        { new: true }
      );
      
      if (dbUser) {
        console.log(`Updated user ${user.id} with new post ${newPost._id}`);
        console.log(`User now has ${dbUser.posts?.length || 0} posts`);
      } else {
        console.warn(`Could not find user with clerkId ${user.id} to update posts array`);
      }
    } catch (userUpdateError) {
      // Don't fail the entire request if we can't update the user
      console.error('Error updating user with new post:', userUpdateError);
    }
    
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 