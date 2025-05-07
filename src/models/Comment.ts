import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: {
    clerkId: string;
    username: string;
    profileImage?: string;
    institution?: string;
    isVerified?: boolean;
    role?: 'mentor' | 'student';
  };
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
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
      profileImage: {
        type: String,
        default: '/images/default-profile.png'
      },
      institution: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      role: {
        type: String,
        enum: ['mentor', 'student'],
        default: 'student'
      },
    },
    postId: {
      type: String,
      required: true,
      index: true,
    }
  },
  { timestamps: true }
);

// Check if model exists already to prevent overwrite during hot reloading
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export default Comment; 