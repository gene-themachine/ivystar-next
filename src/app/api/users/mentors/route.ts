import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    
    // Find all users with role "mentor"
    const mentors = await User.find({ role: 'mentor' });
    
    if (!mentors || mentors.length === 0) {
      return NextResponse.json({ mentors: [] }, { status: 200 });
    }
    
    // Fetch projects for each mentor
    const mentorsWithProjects = await Promise.all(
      mentors.map(async (mentor) => {
        try {
          // Use clerkId to find projects
          const projects = await Project.find({ clerkId: mentor.clerkId });
          
          // Convert mongoose document to plain object and add projects
          const mentorObj = mentor.toObject();
          return {
            ...mentorObj,
            projects: projects || []
          };
        } catch (error) {
          console.error(`Error fetching projects for mentor ${mentor.username}:`, error);
          // Return mentor without projects if there's an error
          return mentor.toObject();
        }
      })
    );
    
    return NextResponse.json({ mentors: mentorsWithProjects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
} 