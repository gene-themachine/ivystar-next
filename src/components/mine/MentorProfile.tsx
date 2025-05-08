'use client';

import ProfileHeader from './ProfileHeader';
import Gallery from './Gallery';
import MessageButton from '@/components/MessageButton';

// Define types for our data
interface MentorProfileProps {
  username: string;
  isVerified: boolean;
  school: string;
  hourlyRate: number;
  joinedDate: string;
  bio: string;
  profileImage: string;
  backgroundImage: string;
  portfolio: {
    src: string;
    thumbnail: string;
    title?: string;
    description?: string;
    width: number;
    height: number;
  }[];
  clerkId?: string; // Add clerkId for messaging
}

const MentorProfile: React.FC<MentorProfileProps> = ({
  username,
  isVerified,
  school,
  hourlyRate,
  joinedDate,
  bio,
  profileImage,
  backgroundImage,
  portfolio,
  clerkId
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

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Top 60% of the page - Header section */}
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {/* Profile Header */}
        <ProfileHeader 
          username={username}
          isVerified={isVerified}
          school={school}
          hourlyRate={hourlyRate}
          timeOnPlatform={getTimeOnPlatform()}
          profileImage={profileImage}
          backgroundImage={backgroundImage}
          recipientId={clerkId} // Pass recipientId instead of onMessageClick
          role="mentor"
        />
      
        {/* Bottom 40% of the page - Content sections */}
        <div className="mt-8">
          {/* Bio Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 relative">
              <div className="absolute top-6 left-0 w-4 h-4 bg-gray-800 transform -translate-x-1/2 rotate-45"></div>
              <p className="text-gray-300">{bio}</p>
            </div>
          </div>

          {/* Portfolio Gallery */}
          <div className="mt-10">
            <Gallery 
              images={portfolio}
              title="Work Samples"
            />
          </div>

          {/* Reviews Section */}
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
    </div>
  );
};

export default MentorProfile; 