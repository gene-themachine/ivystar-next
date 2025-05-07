import { notFound } from 'next/navigation';
import MentorProfile from '@/components/profile/MentorProfile';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';

// Define an interface for the project document returned from MongoDB
interface ProjectDoc {
  _id: string;
  title?: string;
  description?: string;
  summary?: string;
  imageUrl?: string;
  isHighlighted?: boolean;
}

// Fetch real data from MongoDB
const getMentorData = async (username: string) => {
  try {
    await connectDB();
    
    // Find the user by username
    const userData = await User.findOne({ username }).lean();
    
    if (!userData) {
      return null;
    }
    
    // Type-safe access to user data
    const user = userData as any; // Cast to any for flexible property access
    
    // Fetch the user's projects based on their projects array or clerkId
    let projects: ProjectDoc[] = [];
    if (user.projects && Array.isArray(user.projects) && user.projects.length > 0) {
      // Option 1: If user.projects contains project IDs
      projects = await Project.find({ _id: { $in: user.projects } }).lean() as ProjectDoc[];
    } else if (user.clerkId) {
      // Option 2: Fetch by clerkId as fallback
      projects = await Project.find({ clerkId: user.clerkId }).lean() as ProjectDoc[];
    }
    
    console.log(`Found ${projects.length} projects for user ${username}`);
    
    // Format the projects for the gallery component - don't use placeholders if no projects
    const formattedPortfolio = projects.length > 0 
      ? projects.map(project => ({
          src: project.imageUrl || '/images/project-placeholder.png',
          thumbnail: project.imageUrl || '/images/project-placeholder.png',
          title: project.title || 'Untitled Project',
          description: project.description || project.summary || 'No description available',
          width: 1200,
          height: 800,
          isHighlighted: project.isHighlighted || false
        }))
      : []; // Empty array instead of placeholders
    
    // Default bio matching personal profile
    const defaultBio = `I'm a member of the Ivystar community passionate about education and collaboration.`;
    
    // Format the data for the MentorProfile component using same approach as personal profile
    return {
      username: user.username || username,
      isVerified: user.isVerified || false,
      school: user.college || 'Default University',
      hourlyRate: user.hourlyRate || 50,
      joinedDate: "",
      timeOnPlatform: "",
      bio: user.bio || defaultBio,
      profileImage: user.profilePhoto || "/images/default-profile.png",
      backgroundImage: user.backgroundPhoto || null, // Using null for black background fallback
      portfolio: formattedPortfolio,
      clerkId: user.clerkId,
      role: user.role || 'student',
      gradeLevel: user.gradeLevel || 'Freshman',
      interests: user.interests || []
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

type Props = {
  params: Promise<{ username: string }>;
}

export default async function MentorProfilePage(props: Props) {
  const params = await props.params;
  const { username } = params;
  
  const mentorData = await getMentorData(username);
  
  if (!mentorData) {
    notFound();
  }
  
  // Log some details about the profile being viewed
  console.log(`Viewing profile for ${mentorData.username} (${mentorData.role})`);
  console.log(`Portfolio items: ${mentorData.portfolio.length}`);
  
  return <MentorProfile {...mentorData} />;
}
