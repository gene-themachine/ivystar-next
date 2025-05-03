'use client';

import ProfileHeader from './ProfileHeader';
import SimpleGallery from './SimpleGallery';

// Define types for our data
interface MentorProfileProps {
  username: string;
  isVerified: boolean;
  school: string;
  hourlyRate: number;
  joinedDate: string;
  bio: string;
  profileImage: string;
  portfolio: {
    src: string;
    thumbnail: string;
    title?: string;
    description?: string;
    width: number;
    height: number;
  }[];
}

const MentorProfile: React.FC<MentorProfileProps> = ({
  username,
  isVerified,
  school,
  hourlyRate,
  joinedDate,
  bio,
  profileImage,
  portfolio
}) => {
  // Calculate time on platform
  const getTimeOnPlatform = () => {
    const joinDate = new Date(joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months`;
    } else {
      return `${Math.floor(diffDays / 365)} years`;
    }
  };

  const handleMessageClick = () => {
    // This would typically open a message modal or navigate to message page
    alert(`You clicked to message ${username}!`);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Profile Header */}
        <ProfileHeader 
          username={username}
          isVerified={isVerified}
          school={school}
          hourlyRate={hourlyRate}
          timeOnPlatform={getTimeOnPlatform()}
          profileImage={profileImage}
          onMessageClick={handleMessageClick}
        />

        {/* Bio Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 relative">
            <div className="absolute top-6 left-0 w-4 h-4 bg-gray-800 transform -translate-x-1/2 rotate-45"></div>
            <p className="text-gray-300">{bio}</p>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="mt-10">
          <SimpleGallery 
            images={portfolio}
            title="Work Samples"
          />
        </div>

        {/* Reviews Section - This would typically be populated from a database */}
        <div className="mt-10 mb-6">
          <h2 className="text-2xl font-bold mb-5">Student Reviews</h2>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-center py-4">
              No reviews yet. Be the first to leave a review for this mentor!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile; 