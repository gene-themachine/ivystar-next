import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  role: 'mentor' | 'student';
  interests: string[];
  profilePhoto?: string;
  backgroundPhoto?: string;
  bio?: string;
  projectPhoto?: string;
  projectDescription?: string;
  college?: string;
  gradeLevel?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['mentor', 'student'],
      required: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    profilePhoto: {
      type: String,
    },
    backgroundPhoto: {
      type: String,
    },
    bio: {
      type: String,
    },
    projectPhoto: {
      type: String,
    },
    projectDescription: {
      type: String,
    },
    college: {
      type: String,
    },
    gradeLevel: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Check if model exists already to prevent overwrite during hot reloading
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 