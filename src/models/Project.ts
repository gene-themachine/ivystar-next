import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  clerkId: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Check if model exists already to prevent overwrite during hot reloading
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project; 