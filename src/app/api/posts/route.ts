import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// GET all posts
export async function GET() {
  try {
    await connectDB();
    
    // Get current user for checking liked status
    const user = await currentUser();
    let userLikedPosts: string[] = [];
    let userSavedPosts: string[] = [];
    
    // If user is logged in, get their liked and saved posts
    if (user) {
      const userDoc = await User.findOne({ clerkId: user.id });
      userLikedPosts = userDoc?.likedPosts || [];
      userSavedPosts = userDoc?.savedPosts || [];
      console.log(`Found user ${user.id} with ${userLikedPosts.length} liked posts and ${userSavedPosts.length} saved posts`);
    }
    
    // Get all posts, sorted by most recent first
    const posts = await Post.find({}).sort({ createdAt: -1 });
    
    // Add isLiked and isSaved fields to each post
    const postsWithUserStatus = posts.map(post => {
      const postId = post._id.toString();
      const postObj = post.toObject();
      
      // Check if post is liked in two ways for verification
      const isLikedByArray = user ? post.likedBy.includes(user.id) : false;
      const isLikedByUserDoc = userLikedPosts.includes(postId);
      
      // Check if post is saved in two ways for verification
      const isSavedByArray = user ? post.savedBy?.includes(user.id) : false;
      const isSavedByUserDoc = userSavedPosts.includes(postId);
      
      // Log any discrepancies for debugging
      if (isLikedByArray !== isLikedByUserDoc) {
        console.warn(
          `Like status mismatch for post ${postId}: ` +
          `By likedBy array: ${isLikedByArray}, ` +
          `By user's likedPosts: ${isLikedByUserDoc}`
        );
      }
      
      if (isSavedByArray !== isSavedByUserDoc) {
        console.warn(
          `Save status mismatch for post ${postId}: ` +
          `By savedBy array: ${isSavedByArray}, ` +
          `By user's savedPosts: ${isSavedByUserDoc}`
        );
      }
      
      // Ensure consistency in both user and post collections for likes
      if (user && isLikedByArray !== isLikedByUserDoc) {
        console.log(`Fixing like status inconsistency for post ${postId}...`);
        // We'll trust the post.likedBy as the source of truth
        // This fixes the issue silently in the background
        if (isLikedByArray && !isLikedByUserDoc) {
          // Add missing post ID to user's likedPosts
          User.updateOne(
            { clerkId: user.id },
            { $addToSet: { likedPosts: postId } }
          ).catch(err => console.error('Error updating user liked posts:', err));
        } else if (!isLikedByArray && isLikedByUserDoc) {
          // Remove post ID from user's likedPosts
          User.updateOne(
            { clerkId: user.id },
            { $pull: { likedPosts: postId } }
          ).catch(err => console.error('Error updating user liked posts:', err));
        }
      }
      
      // Ensure consistency in both user and post collections for saves
      if (user && isSavedByArray !== isSavedByUserDoc) {
        console.log(`Fixing save status inconsistency for post ${postId}...`);
        // We'll trust the post.savedBy as the source of truth
        // This fixes the issue silently in the background
        if (isSavedByArray && !isSavedByUserDoc) {
          // Add missing post ID to user's savedPosts
          User.updateOne(
            { clerkId: user.id },
            { $addToSet: { savedPosts: postId } }
          ).catch(err => console.error('Error updating user saved posts:', err));
        } else if (!isSavedByArray && isSavedByUserDoc) {
          // Remove post ID from user's savedPosts
          User.updateOne(
            { clerkId: user.id },
            { $pull: { savedPosts: postId } }
          ).catch(err => console.error('Error updating user saved posts:', err));
        }
      }
      
      // For the UI, use the arrays as source of truth
      const isLiked = isLikedByArray;
      const isSaved = isSavedByArray;
      
      // Log liked and saved status
      if (user && (isLiked || isSaved)) {
        console.log(`Post ${postId} status for user ${user.id}: liked=${isLiked}, saved=${isSaved}`);
      }
      
      return {
        ...postObj,
        isLiked,
        isSaved,
        // Ensure likes and saves counts are accurate
        likes: post.likedBy.length,
        saves: post.savedBy?.length || 0
      };
    });
    
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
    
    return NextResponse.json({ posts: postsWithUserStatus }, { status: 200 });
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
      likedBy: [], // Initialize empty likedBy array
      saves: 0,    // Initialize saves count
      savedBy: [], // Initialize empty savedBy array
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