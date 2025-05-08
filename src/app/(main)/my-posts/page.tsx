'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Post from '@/components/Post';
import { PostType } from '@/types';

export default function MyPostsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to format timestamps
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;

    return seconds < 10 ? 'just now' : `${seconds} seconds ago`;
  };

  // Fetch posts after user is loaded
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/user/${user.id}`, {
          cache: 'no-store',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();

        const formatted: PostType[] = data.posts.map((post: any) => {
          let profileImage: string | null = null;
          if (post.author?.profileImage) {
            const imgUrl = post.author.profileImage.trim();
            if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/')) {
              profileImage = imgUrl;
            }
          }

          return {
            id: post._id,
            author: post.author.username || 'Anonymous',
            isVerified: post.author.isVerified || false,
            profileImage,
            institution:
              post.author.institution &&
              post.author.institution !== 'Unknown Institution' &&
              post.author.institution !== 'Default University'
                ? post.author.institution
                : undefined,
            timeAgo: formatTimeAgo(post.createdAt),
            community: post.community || 'General',
            title: post.title,
            content: post.content,
            tags: post.tags || [],
            likes: post.likes || 0,
            comments: post.comments || 0,
            isLiked: post.isLiked === true,
            isSaved: post.isSaved === true,
            fieldOfStudy: post.author.field && post.author.field !== 'N/A' ? post.author.field : undefined,
            images: post.images || [],
            role: post.author.role || 'student',
          } as PostType;
        });

        setPosts(formatted);
      } catch (err) {
        console.error(err);
        setError('Could not load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      if (!user) {
        router.push('/sign-in');
        return;
      }
      fetchPosts();
    }
  }, [isLoaded, user, router]);

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Posts</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-md text-sm"
          >
            Back
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-400">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-gray-300 mb-2">No Posts Yet</h2>
            <p className="text-gray-400 mb-6">You haven&apos;t shared anything yet.</p>
            <button
              onClick={() => router.push('/new-post')}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} {...post} onPostClick={(id) => router.push(`/post/${id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
