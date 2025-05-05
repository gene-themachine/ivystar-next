export interface PostType {
  id: string;
  author: string;
  isVerified: boolean;
  profileImage: string;
  institution: string;
  timeAgo: string;
  community: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  fieldOfStudy?: string;
}

export interface UserMetadata {
  username?: string;
  role?: 'mentor' | 'student';
  interests?: string[];
  profilePhoto?: string;
  backgroundPhoto?: string;
  college?: string;
  bio?: string;
} 