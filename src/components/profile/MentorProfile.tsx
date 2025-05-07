'use client';

import ProfileHeader from './ProfileHeader';
import Gallery from './Gallery';

// Define types for our data
interface MentorProfileProps {
  username: string;
  isVerified: boolean;
  school: string;
  hourlyRate: number;
  joinedDate: string;
  timeOnPlatform?: string;
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
    isHighlighted?: boolean;
  }[];
  clerkId?: string;
  role?: 'mentor' | 'student';
  gradeLevel?: string;
  interests?: string[];
}

const MentorProfile: React.FC<MentorProfileProps> = ({
  username,
  isVerified,
  school,
  hourlyRate,
  joinedDate,
  timeOnPlatform,
  bio,
  profileImage,
  backgroundImage,
  portfolio,
  clerkId,
  role = 'mentor',
  gradeLevel,
  interests = []
}) => {
  // Calculate time on platform only if not already provided
  const calculatedTimeOnPlatform = timeOnPlatform || (() => {
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
  })();

  const handleMessageClick = () => {
    // This would typically open a message modal or navigate to message page
    alert(`You clicked to message ${username}!`);
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
          timeOnPlatform={calculatedTimeOnPlatform}
          profileImage={profileImage}
          backgroundImage={backgroundImage}
          onMessageClick={handleMessageClick}
          role={role}
          gradeLevel={gradeLevel}
          clerkId={clerkId}
        />
      
        {/* Bottom 40% of the page - Content sections */}
        <div className="mt-8">
          {/* Interests Section - if available */}
          {interests && interests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${role === 'mentor' 
                          ? 'bg-orange-900/30 text-orange-400 border border-orange-700/30' 
                          : 'bg-blue-900/30 text-blue-400 border border-blue-700/30'}`}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Bio Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 relative">
              <div className="absolute top-6 left-0 w-4 h-4 bg-gray-800 transform -translate-x-1/2 rotate-45"></div>
              <p className="text-gray-300">{bio}</p>
            </div>
          </div>

          {/* Portfolio Gallery - only show if portfolio has items */}
          {portfolio.length > 0 && (
            <div className="mt-10">
              <Gallery 
                images={portfolio}
                title="Work Samples"
              />
            </div>
          )}

          {/* Reviews Section - only show for mentors */}
          {role === 'mentor' && (
            <div className="mt-10 mb-6">
              <h2 className="text-2xl font-bold mb-5">Student Reviews</h2>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <p className="text-gray-400 text-center py-4">
                  No reviews yet. Be the first to leave a review for this mentor!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile; 