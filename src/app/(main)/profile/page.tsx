'use client';

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useUserStore } from "@/store/user-store";
import { useUploadThing } from "@/lib/uploadthing";
import { 
  ProfileHeader, 
  ProfileBioSection, 
  ProfilePortfolio,
  ProfileActions
} from "@/components/mine";
import { useRouter } from "next/navigation";
import Post from "@/components/Post";
import { PostType } from "@/types";

// Define the type for unsafeMetadata
interface UserMetadata {
  username?: string;
  role?: 'mentor' | 'student';
  interests?: string[];
  profilePhoto?: string;
  backgroundPhoto?: string;
  college?: string;
  bio?: string;
  hourlyRate?: number;
  gradeLevel?: string;
  isVerified?: boolean; // Optional verification status for mentors
  workSamples?: {
    id: string;
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
    isHighlighted?: boolean;
  }[];
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { username: storeUsername } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [workSamples, setWorkSamples] = useState<Array<{
    id: string;
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
    isHighlighted?: boolean;
  }>>([]);
  const backgroundInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const profileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const { startUpload } = useUploadThing("imageUploader");
  
  // Router for navigating to post detail pages
  const router = useRouter();
  
  // State for user's own posts
  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  
  // Get display username from different sources with fallbacks
  const displayUsername = storeUsername || 
                         (user?.unsafeMetadata as any)?.username || 
                         user?.username || 
                         "Default User";
  
  // Get metadata with fallbacks
  const metadata = user?.unsafeMetadata as UserMetadata | undefined;
  const profilePhoto = metadata?.profilePhoto || user?.imageUrl || null;
  const backgroundPhoto = metadata?.backgroundPhoto || null;
  const userRole = metadata?.role || 'student';
  // Only set default university for mentors, empty for students
  const college = metadata?.college || (userRole === 'mentor' ? "Default University" : "");
  const defaultBio = `I'm a member of the Ivystar community passionate about education and collaboration.`;
  const bio = metadata?.bio || defaultBio;
  console.log("User role from Clerk:", userRole); // Debug user role
  const gradeLevel = metadata?.gradeLevel || 'Freshman';
  const interests = metadata?.interests || []; // Get interests with empty array fallback
  const isVerified = metadata?.isVerified || false;
  const hourlyRate = metadata?.hourlyRate || 50; // Get hourlyRate with default 50
  
  // Initial profile data
  const [profileData, setProfileData] = useState({
    username: displayUsername,
    isVerified: isVerified,
    school: college,
    hourlyRate: hourlyRate,
    profileImage: profilePhoto,
    backgroundImage: backgroundPhoto as string | null,
    bio: bio,
    role: userRole,
    gradeLevel: gradeLevel,
    interests: interests,
  });
  
  // Form state for editable fields
  const [editForm, setEditForm] = useState({
    school: college,
    bio: bio,
    backgroundImage: backgroundPhoto as string | null,
    interests: interests,
    hourlyRate: hourlyRate,
  });
  
  // Background file to upload
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  
  // Helper to format dates into "time ago"
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

    return seconds < 10 ? "just now" : `${seconds} seconds ago`;
  };
  
  // Update profile data when user data changes
  useEffect(() => {
    if (isLoaded) {
      // Get the latest metadata
      const metadata = user?.unsafeMetadata as UserMetadata | undefined;
      const profilePhoto = metadata?.profilePhoto || user?.imageUrl || "/images/default-profile.png";
      const backgroundPhoto = metadata?.backgroundPhoto || null;
      const userRole = metadata?.role || 'student';
      // Only set default university for mentors, empty for students
      const college = metadata?.college || (userRole === 'mentor' ? "Default University" : "");
      const defaultBio = `I'm a member of the Ivystar community passionate about education and collaboration.`;
      const bio = metadata?.bio || defaultBio;
      const gradeLevel = metadata?.gradeLevel || 'Freshman';
      const interests = metadata?.interests || []; // Get interests with empty array fallback
      const isVerified = metadata?.isVerified || false;
      const hourlyRate = metadata?.hourlyRate || 50; // Get hourlyRate with default 50
      
      // Fetch projects from MongoDB
      const fetchProjects = async () => {
        try {
          const response = await fetch('/api/projects');
          if (response.ok) {
            const data = await response.json();
            // Use MongoDB projects if available, fallback to Clerk metadata
            let projects = data.projects && data.projects.length > 0 
              ? data.projects 
              : (metadata?.workSamples || []);
            
            // Ensure all projects have valid, consistent IDs
            projects = projects.map((project: { 
              id?: string;
              title: string;
              summary: string;
              description: string;
              imageUrl: string;
              isHighlighted?: boolean;
            }) => ({
              ...project,
              id: project.id || `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }));
            
            console.log("Fetched projects:", projects);
            setWorkSamples(projects);
          } else {
            // Fallback to Clerk metadata if MongoDB fetch fails
            const projects = (metadata?.workSamples || []).map((project: { 
              id?: string;
              title: string;
              summary: string;
              description: string;
              imageUrl: string;
              isHighlighted?: boolean;
            }) => ({
              ...project,
              id: project.id || `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }));
            setWorkSamples(projects);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          // Fallback to Clerk metadata
          const projects = (metadata?.workSamples || []).map((project: { 
            id?: string;
            title: string;
            summary: string;
            description: string;
            imageUrl: string;
            isHighlighted?: boolean;
          }) => ({
            ...project,
            id: project.id || `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }));
          setWorkSamples(projects);
        }
      };
      
      fetchProjects();
      
      // Fetch user's own posts
      const fetchMyPosts = async () => {
        try {
          if (!user) return;
          setIsPostsLoading(true);
          const response = await fetch(`/api/posts/user/${user.id}`, {
            credentials: "include",
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }

          const data = await response.json();

          const formattedPosts: PostType[] = data.posts.map((post: any) => {
            let profileImage = null;
            if (post.author?.profileImage) {
              const imgUrl = post.author.profileImage.trim();
              if (
                imgUrl &&
                (imgUrl.startsWith("http://") || imgUrl.startsWith("https://") || imgUrl.startsWith("/"))
              ) {
                profileImage = imgUrl;
              }
            }

            return {
              id: post._id,
              author: post.author.username || "Anonymous",
              isVerified: post.author.isVerified || false,
              profileImage,
              institution:
                post.author.institution &&
                post.author.institution !== "Unknown Institution" &&
                post.author.institution !== "Default University"
                  ? post.author.institution
                  : undefined,
              timeAgo: formatTimeAgo(post.createdAt),
              community: post.community || "General",
              title: post.title,
              content: post.content,
              tags: post.tags || [],
              likes: post.likes || 0,
              comments: post.comments || 0,
              isLiked: post.isLiked === true,
              isSaved: post.isSaved === true,
              fieldOfStudy:
                post.author.field && post.author.field !== "N/A"
                  ? post.author.field
                  : undefined,
              images: post.images || [],
              role: post.author.role || "student",
            } as PostType;
          });

          setMyPosts(formattedPosts);
          setPostsError(null);
        } catch (err) {
          console.error("Error fetching user posts:", err);
          setPostsError("Failed to load posts. Please try again later.");
        } finally {
          setIsPostsLoading(false);
        }
      };

      fetchMyPosts();
      
      setProfileData(prev => ({
        ...prev,
        username: displayUsername,
        profileImage: profilePhoto,
        backgroundImage: backgroundPhoto,
        school: college,
        bio: bio,
        role: userRole,
        gradeLevel: gradeLevel,
        isVerified: isVerified,
        interests: interests,
        hourlyRate: hourlyRate,
      }));
      
      setEditForm({
        school: college,
        bio: bio,
        backgroundImage: backgroundPhoto,
        interests: interests,
        hourlyRate: hourlyRate,
      });
      
      setIsInitialized(true);
    }
  }, [isLoaded, displayUsername, user?.unsafeMetadata, user?.imageUrl]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      // Create a temporary preview URL
      const url = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, backgroundImage: url }));
    }
  };

  const triggerBackgroundInput = () => {
    backgroundInputRef.current?.click();
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      // Create a temporary preview URL
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profileImage: url }));
    }
  };

  const triggerProfileInput = () => {
    profileInputRef.current?.click();
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form to current values
    setEditForm({
      school: profileData.school,
      bio: profileData.bio,
      backgroundImage: profileData.backgroundImage,
      interests: profileData.interests,
      hourlyRate: profileData.hourlyRate,
    });
    setBackgroundFile(null);
    setProfileFile(null);
    setIsEditing(false);
  };
  
  const handleFormChange = (field: 'bio' | 'school' | 'hourlyRate', value: string | number) => {
    console.log(`Updating ${field} to:`, value);
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestsChange = (newInterests: string[]) => {
    setEditForm(prev => ({ ...prev, interests: newInterests }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      let finalBackgroundUrl = editForm.backgroundImage;
      let finalProfileUrl = profileData.profileImage;
      
      // Upload background photo if changed
      if (backgroundFile) {
        const uploadResult = await startUpload([backgroundFile]);
        if (uploadResult && uploadResult[0]) {
          finalBackgroundUrl = uploadResult[0].url;
          
          // Delete the old background image if it's from uploadthing
          if (metadata?.backgroundPhoto && (
              metadata.backgroundPhoto.includes('uploadthing') || 
              metadata.backgroundPhoto.includes('utfs.io')
          )) {
            try {
              let fileKey;
              
              // Try to extract the file key from the URL
              try {
                const url = new URL(metadata.backgroundPhoto);
                const pathParts = url.pathname.split('/');
                fileKey = pathParts[pathParts.length - 1];
              } catch (e) {
                // If URL parsing fails, try simple extraction
                const urlParts = metadata.backgroundPhoto.split('/');
                fileKey = urlParts[urlParts.length - 1];
              }
              
              if (!fileKey) {
                console.error("Could not extract file key from URL:", metadata.backgroundPhoto);
                return;
              }
              
              console.log("Deleting file with key:", fileKey);
              
              // Call the API to delete the file
              const response = await fetch('/api/delete-file', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  fileKey,
                  fileUrl: metadata.backgroundPhoto  // Pass the full URL as well
                }),
              });
              
              const result = await response.json();
              console.log("File deletion result:", result);
              
            } catch (error) {
              console.error("Error deleting old background:", error);
            }
          }
        }
      }
      
      // Upload profile photo if changed
      if (profileFile) {
        const uploadResult = await startUpload([profileFile]);
        if (uploadResult && uploadResult[0]) {
          finalProfileUrl = uploadResult[0].url;
        }
      }

      // Update metadata in Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          backgroundPhoto: finalBackgroundUrl,
          profilePhoto: finalProfileUrl,
          college: editForm.school,
          bio: editForm.bio,
          interests: editForm.interests,
          hourlyRate: editForm.hourlyRate,
        }
      });
      
      // Update in MongoDB
      try {
        // Always include hourlyRate for both mentors and students
        const hourlyRate = editForm.hourlyRate;

        const mongoData = {
          clerkId: user.id,
          username: profileData.username,
          email: user.primaryEmailAddress?.emailAddress,
          role: profileData.role,
          college: editForm.school,
          profilePhoto: finalProfileUrl,
          backgroundPhoto: finalBackgroundUrl,
          bio: editForm.bio,
          interests: editForm.interests,
          gradeLevel: profileData.gradeLevel,
          hourlyRate: hourlyRate, // Explicitly include hourlyRate for all users
        };
        
        // Update in MongoDB
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mongoData)
        });
        
        if (!response.ok) {
          console.error('MongoDB update failed:', await response.text());
        } else {
          console.log('Profile updated in MongoDB successfully');
          const result = await response.json();
          console.log('Updated user data with hourlyRate:', result.user?.hourlyRate);
        }
      } catch (mongoError) {
        console.error('Error updating MongoDB:', mongoError);
      }
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        backgroundImage: finalBackgroundUrl,
        profileImage: finalProfileUrl,
        school: editForm.school,
        bio: editForm.bio,
        interests: editForm.interests,
        hourlyRate: editForm.hourlyRate,
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle update work samples
  const handleUpdateWorkSamples = async (samples: {
    id: string;
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
    isHighlighted?: boolean;
  }[]) => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      
      // Ensure only one project is highlighted - simplified and more explicit approach
      const highlightedSamples = samples.filter(sample => sample.isHighlighted);
      
      // If more than one project is highlighted, force only one to be highlighted
      if (highlightedSamples.length > 1) {
        console.log("Multiple highlighted projects detected. Fixing...");
        
        // Create a new array with all highlights turned off
        let processedSamples = samples.map(sample => ({
          ...sample,
          isHighlighted: false
        }));
        
        // Only highlight the most recently selected project
        const mostRecentHighlighted = highlightedSamples[highlightedSamples.length - 1];
        const targetIndex = processedSamples.findIndex(s => s.id === mostRecentHighlighted.id);
        
        if (targetIndex !== -1) {
          processedSamples[targetIndex].isHighlighted = true;
          console.log(`Fixed: Only "${processedSamples[targetIndex].title}" is now highlighted.`);
        }
        
        // Replace the original samples with our fixed version
        samples = processedSamples;
      }
      
      // Count highlighted samples after fix (should be 0 or 1)
      const highlightedCount = samples.filter(s => s.isHighlighted).length;
      console.log(`Saving ${samples.length} projects with ${highlightedCount} highlighted project(s)`);
      
      // Update metadata in Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          workSamples: samples
        }
      });
      
      // Update in MongoDB
      try {
        // Prepare projects for MongoDB
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projects: samples })
        });
        
        if (!response.ok) {
          console.error('MongoDB project update failed:', await response.text());
        } else {
          console.log('Projects updated in MongoDB successfully');
          
          // Log the highlighted project if there is one
          const highlightedProject = samples.find(s => s.isHighlighted);
          if (highlightedProject) {
            console.log(`Highlighted project: ${highlightedProject.title}`);
          } else {
            console.log('No project is currently highlighted');
          }
        }
      } catch (mongoError) {
        console.error('Error updating projects in MongoDB:', mongoError);
      }
      
      // Update local state with the fixed samples
      setWorkSamples([...samples]);
      
    } catch (error) {
      console.error("Error updating work samples:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state while data is being initialized
  if (!isInitialized) {
    return (
      <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mr-3 h-8 w-8 border-t-2 border-b-2 border-orange-500 rounded-full"></div>
          <p className="mt-2 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <ErrorBoundary>
          <div className="relative">
            {/* Profile Header */}
            <ProfileHeader
              username={profileData.username}
              isVerified={profileData.isVerified}
              school={isEditing ? editForm.school : profileData.school}
              hourlyRate={profileData.hourlyRate}
              timeOnPlatform=""
              profileImage={profileData.profileImage || "/images/default-profile.png"}
              backgroundImage={isEditing ? editForm.backgroundImage : profileData.backgroundImage}
              showMessageButton={false}
              role={profileData.role}
              gradeLevel={profileData.gradeLevel}
              isEditing={isEditing}
            />
            
            {/* Profile Actions (edit/save buttons, background upload) */}
            <ProfileActions
              isEditing={isEditing}
              isUploading={isUploading}
              username={profileData.username}
              backgroundInputRef={backgroundInputRef}
              profileInputRef={profileInputRef}
              onBackgroundChange={handleBackgroundChange}
              onProfileChange={handleProfileChange}
              onTriggerBackgroundInput={triggerBackgroundInput}
              onTriggerProfileInput={triggerProfileInput}
              onCancelEdit={handleCancelEdit}
              onSaveProfile={handleSaveProfile}
            />
          </div>
        </ErrorBoundary>

        {/* Interests Section */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mt-6 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Interests</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  {/* Display editable interests tags */}
                  {editForm.interests.map((interest, index) => (
                    <div 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center 
                        ${profileData.role === 'mentor' 
                          ? 'bg-orange-900/30 text-orange-400 border border-orange-700/30' 
                          : 'bg-blue-900/30 text-blue-400 border border-blue-700/30'}`}
                    >
                      <span>{interest}</span>
                      <button 
                        className="ml-1.5 hover:text-white"
                        onClick={() => {
                          const updatedInterests = [...editForm.interests];
                          updatedInterests.splice(index, 1);
                          handleInterestsChange(updatedInterests);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new interest input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Add interest..."
                      className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm text-gray-300"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newInterest = e.currentTarget.value.trim();
                          if (!editForm.interests.includes(newInterest)) {
                            handleInterestsChange([...editForm.interests, newInterest]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const newInterest = input.value.trim();
                          if (!editForm.interests.includes(newInterest)) {
                            handleInterestsChange([...editForm.interests, newInterest]);
                            input.value = '';
                          }
                        }
                      }}
                      className={`px-2 py-1 rounded-md text-xs ${
                        profileData.role === 'mentor' ? 'bg-orange-800 text-white' : 'bg-blue-800 text-white'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </>
              ) : (
                // Display read-only interests
                profileData.interests.length > 0 ? (
                  profileData.interests.map((interest, index) => (
                    <div 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${profileData.role === 'mentor' 
                          ? 'bg-orange-900/30 text-orange-400 border border-orange-700/30' 
                          : 'bg-blue-900/30 text-blue-400 border border-blue-700/30'}`}
                    >
                      {interest}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No interests added yet</p>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <ProfileBioSection
          bio={profileData.bio}
          isEditing={isEditing}
          school={profileData.school}
          editForm={editForm}
          onEditClick={handleEditProfile}
          onFormChange={handleFormChange}
          role={profileData.role}
        />
        
        {/* Portfolio Gallery */}
        <ProfilePortfolio
          workSamples={workSamples}
          onUpdateWorkSamples={handleUpdateWorkSamples}
        />

        {/* Button to view My Posts page - now at bottom */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/my-posts')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            View My Posts
          </button>
        </div>
      </div>
    </div>
  );
}
