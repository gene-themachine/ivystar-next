import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

// GET handler to fetch all projects for a user
export async function GET(request: NextRequest) {
  const user = await currentUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectDB();
    
    // Get clerkId from the URL search params (if provided)
    const searchParams = request.nextUrl.searchParams;
    const clerkId = searchParams.get('clerkId') || user.id;
    
    // Find all projects for this user
    const projects = await Project.find({ clerkId })
      .sort({ createdAt: -1 }) // Newest first
      .lean();
    
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST handler to create/update a project
export async function POST(request: NextRequest) {
  const user = await currentUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectDB();
    
    const body = await request.json();
    const { projects } = body;
    
    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: 'Projects array is required' },
        { status: 400 }
      );
    }
    
    // Validate: ensure only one project is highlighted
    const highlightedProjects = projects.filter(project => project.isHighlighted);
    
    if (highlightedProjects.length > 1) {
      return NextResponse.json(
        { error: 'Only one project can be highlighted at a time' },
        { status: 400 }
      );
    }
    
    // First delete all existing projects for this user
    await Project.deleteMany({ clerkId: user.id });
    
    // Then create new projects
    const createdProjects = await Project.create(
      projects.map((project: any) => ({
        ...project,
        clerkId: user.id
      }))
    );
    
    // Get the project IDs to update the User document
    const projectIds = createdProjects.map(project => project._id.toString());
    
    // Update the User document with the project IDs
    const userUpdateResult = await User.findOneAndUpdate(
      { clerkId: user.id },
      { $set: { projects: projectIds } },
      { new: true }
    );
    
    console.log(`Updated user ${user.id} with ${projectIds.length} projects`);
    
    // Log the highlighted project if there is one
    const highlightedProject = createdProjects.find(p => p.isHighlighted);
    if (highlightedProject) {
      console.log(`User ${user.id} highlighted project: "${highlightedProject.title}"`);
    }
    
    return NextResponse.json({ 
      message: 'Projects saved successfully',
      projects: createdProjects,
      userProjects: userUpdateResult?.projects || []
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving projects:', error);
    return NextResponse.json(
      { error: 'Failed to save projects' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a specific project
export async function DELETE(request: NextRequest) {
  const user = await currentUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Find the project to verify ownership
    const project = await Project.findById(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Check if the user owns this project
    if (project.clerkId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this project' },
        { status: 403 }
      );
    }
    
    // Delete the project
    await Project.findByIdAndDelete(projectId);
    
    // Update the User document to remove this project ID
    await User.findOneAndUpdate(
      { clerkId: user.id },
      { $pull: { projects: projectId } }
    );
    
    console.log(`Removed project ${projectId} from user ${user.id}`);
    
    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 