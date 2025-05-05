'use client';

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useUserStore } from "@/store/user-store";
import { useUploadThing } from "@/lib/uploadthing";
import { 
  ProfileHeader, 
  ProfileBioSection, 
  ProfileAccountSettings, 
  ProfilePortfolio,
  ProfileActions
} from "@/components/mine";

// Define the type for unsafeMetadata
interface UserMetadata {
  username?: string;
  role?: 'mentor' | 'student';
  interests?: string[];
  profilePhoto?: string;
  backgroundPhoto?: string;
  college?: string;
  bio?: string;
  gradeLevel?: string;
  isVerified?: boolean; // Optional verification status for mentors
  workSamples?: {
    id: string;
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
  }[];
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { username: storeUsername } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const backgroundInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const { startUpload } = useUploadThing("imageUploader");
  
  // Get display username from different sources with fallbacks
  const displayUsername = storeUsername || 
                         (user?.unsafeMetadata as any)?.username || 
                         user?.username || 
                         "Default User";
  
  // Get metadata with fallbacks
  const metadata = user?.unsafeMetadata as UserMetadata | undefined;
  const profilePhoto = metadata?.profilePhoto || user?.imageUrl || "/default-profile.jpg";
  const backgroundPhoto = metadata?.backgroundPhoto || null;
  const college = metadata?.college || "Default University";
  const defaultBio = `I'm a member of the Ivystar community passionate about education and collaboration.`;
  const bio = metadata?.bio || defaultBio;
  const userRole = metadata?.role || 'student';
  const gradeLevel = metadata?.gradeLevel || 'Freshman';
  const workSamples = metadata?.workSamples || [];
  const isVerified = metadata?.isVerified || false; // Default to not verified
  
  // Initial profile data
  const [profileData, setProfileData] = useState({
    username: displayUsername,
    isVerified: isVerified,
    school: college,
    hourlyRate: 50,
    memberSince: "January 2023",
    profileImage: profilePhoto,
    backgroundImage: backgroundPhoto as string | null,
    bio: bio,
    role: userRole,
    gradeLevel: gradeLevel,
  });
  
  // Form state for editable fields
  const [editForm, setEditForm] = useState({
    school: college,
    bio: bio,
    backgroundImage: backgroundPhoto as string | null,
  });
  
  // Background file to upload
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  
  // Update profile data when user data changes
  useEffect(() => {
    if (isLoaded) {
      // Get the latest metadata
      const metadata = user?.unsafeMetadata as UserMetadata | undefined;
      const profilePhoto = metadata?.profilePhoto || user?.imageUrl || "/images/default-profile.png";
      const backgroundPhoto = metadata?.backgroundPhoto || null;
      const college = metadata?.college || "Default University";
      const defaultBio = `I'm a member of the Ivystar community passionate about education and collaboration.`;
      const bio = metadata?.bio || defaultBio;
      const userRole = metadata?.role || 'student';
      const gradeLevel = metadata?.gradeLevel || 'Freshman';
      const isVerified = metadata?.isVerified || false;
      
      setProfileData(prev => ({
        ...prev,
        username: displayUsername,
        profileImage: profilePhoto,
        backgroundImage: backgroundPhoto,
        school: college,
        bio: bio,
        role: userRole,
        gradeLevel: gradeLevel,
        isVerified: isVerified
      }));
      
      setEditForm({
        school: college,
        bio: bio,
        backgroundImage: backgroundPhoto
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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form to current values
    setEditForm({
      school: profileData.school,
      bio: profileData.bio,
      backgroundImage: profileData.backgroundImage
    });
    setBackgroundFile(null);
    setIsEditing(false);
  };
  
  const handleFormChange = (field: 'bio' | 'school', value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      let finalBackgroundUrl = editForm.backgroundImage;
      
      // Check if we're replacing the background image
      if (backgroundFile) {
        // Upload new background image
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
      
      // Update metadata in Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          backgroundPhoto: finalBackgroundUrl,
          college: editForm.school,
          bio: editForm.bio
        }
      });
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        backgroundImage: finalBackgroundUrl,
        school: editForm.school,
        bio: editForm.bio
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
  }[]) => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      
      // Update metadata in Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          workSamples: samples
        }
      });
      
      // Update local state if needed
      console.log("Work samples updated successfully");
      
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
              timeOnPlatform={profileData.memberSince}
              profileImage={profileData.profileImage}
              backgroundImage={isEditing ? editForm.backgroundImage : profileData.backgroundImage}
              showMessageButton={false}
              role={profileData.role}
              gradeLevel={profileData.gradeLevel}
            />
            
            {/* Profile Actions (edit/save buttons, background upload) */}
            <ProfileActions
              isEditing={isEditing}
              isUploading={isUploading}
              username={profileData.username}
              backgroundInputRef={backgroundInputRef}
              onBackgroundChange={handleBackgroundChange}
              onTriggerBackgroundInput={triggerBackgroundInput}
              onCancelEdit={handleCancelEdit}
              onSaveProfile={handleSaveProfile}
            />
          </div>
        </ErrorBoundary>

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
        
        {/* Account Settings */}
        <ProfileAccountSettings
          onEditProfile={handleEditProfile}
          onEditPortfolio={() => window.scrollTo({ top: document.getElementById('portfolio-section')?.offsetTop || 0, behavior: 'smooth' })}
        />
      </div>
    </div>
  );
}
