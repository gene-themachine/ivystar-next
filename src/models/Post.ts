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
    role?: 'mentor' | 'student';
  };
  images?: string[];
  tags?: string[];
  community?: string;
  likes: number;
  likedBy: string[]; // Array of clerkIds who liked this post
  saves: number;
  savedBy: string[]; // Array of clerkIds who saved this post
  comments: number;
  createdAt: Date;
  updatedAt: Date;
  // Method to check if a user has liked the post
  isLikedBy(clerkId: string): boolean;
  // Method to check if a user has saved the post
  isSavedBy(clerkId: string): boolean;
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
    images: [String],
    tags: [String],
    community: String,
    // Legacy likes field maintained for backwards compatibility
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String], // Array of clerk IDs who liked this post
      default: [],
    },
    // Saves count field
    saves: {
      type: Number,
      default: 0,
    },
    savedBy: {
      type: [String], // Array of clerk IDs who saved this post
      default: [],
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Add a method to check if a user has liked the post
postSchema.methods.isLikedBy = function(clerkId: string): boolean {
  return this.likedBy.includes(clerkId);
};

// Add a method to check if a user has saved the post
postSchema.methods.isSavedBy = function(clerkId: string): boolean {
  return this.savedBy.includes(clerkId);
};

// Virtual getter for likes that returns the length of likedBy array
postSchema.virtual('likeCount').get(function() {
  return this.likedBy.length;
});

// Virtual getter for saves that returns the length of savedBy array
postSchema.virtual('saveCount').get(function() {
  return this.savedBy.length;
});

// Check if model exists already to prevent overwrite during hot reloading
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post; 