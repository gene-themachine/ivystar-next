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
  hourlyRate?: number;
  projectPhoto?: string;
  projectDescription?: string;
  college?: string;
  gradeLevel?: string;
  isVerified?: boolean;
  posts?: string[]; // Array of post IDs
  projects?: string[]; // Array of project IDs
  likedPosts?: string[]; // Array of liked post IDs
  savedPosts?: string[]; // Array of saved post IDs
  savedMentors?: string[]; // Array of saved mentor IDs (clerkIds)
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
    hourlyRate: {
      type: Number,
      default: 50,
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
    },
    posts: {
      type: [String], // Array of post IDs
      default: [],
    },
    projects: {
      type: [String], // Array of project IDs
      default: [],
    },
    likedPosts: {
      type: [String], // Array of liked post IDs
      default: [],
    },
    savedPosts: {
      type: [String], // Array of saved post IDs
      default: [],
    },
    savedMentors: {
      type: [String], // Array of saved mentor IDs (clerkIds)
      default: [],
    }
  },
  { timestamps: true }
);

// Check if model exists already to prevent overwrite during hot reloading
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 