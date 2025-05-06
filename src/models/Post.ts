import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: {
    clerkId: string;
    username: string;
    profileImage?: string;
    institution?: string;
    isVerified?: boolean;
  };
  images?: string[];
  tags?: string[];
  community?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      clerkId: {
        type: String,
        required: true,
        index: true,
      },
      username: {
        type: String,
        required: true,
      },
      profileImage: String,
      institution: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    images: [String],
    tags: [String],
    community: String,
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Check if model exists already to prevent overwrite during hot reloading
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post; 