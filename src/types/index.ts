export interface PostType {
  id: string;
  author: string;
  isVerified?: boolean;
  profileImage: string | null;
  institution: string;
  timeAgo: string;
  community?: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  fieldOfStudy?: string;
  images?: string[];
  hasMentorResponse?: boolean;
  role?: 'mentor' | 'student';
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