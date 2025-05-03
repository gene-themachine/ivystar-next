import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaCheckCircle, FaExternalLinkAlt, FaUniversity, FaUser } from "react-icons/fa";
import Image from "next/image";

export default async function ProfilePage() {
  const user = await currentUser();
  
  // Mock mentor data for the current user
  const mentorData = {
    username: "Arts_guy",
    isVerified: true,
    school: "Dartmouth College",
    hourlyRate: 50,
    memberSince: "January 2023"
  };
  
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32"></div>
          
          <div className="px-5 py-6 -mt-14 relative">
            {/* Profile Image */}
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl">
                {user?.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt={user?.username || "Profile"} 
                    width={112} 
                    height={112} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <FaUser className="text-gray-400 text-3xl" />
                  </div>
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="mt-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">
                  {user?.username || mentorData.username || "Your Profile"}
                </h1>
                {mentorData.isVerified && (
                  <FaCheckCircle className="text-blue-500 ml-2 text-lg" />
                )}
              </div>
              
              <div className="flex items-center text-gray-400 mt-1">
                <FaUniversity className="mr-2" />
                <span>{mentorData.school}</span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-gray-800 px-3 py-1.5 rounded-lg text-white text-sm">
                  Member since: <span className="text-blue-400 font-medium">{mentorData.memberSince}</span>
                </div>
                
                <div className="bg-gray-800 px-3 py-1.5 rounded-lg text-white text-sm">
                  Hourly rate: <span className="text-green-400 font-medium">${mentorData.hourlyRate}/hr</span>
                </div>
              </div>
              
              {/* View Public Profile Button */}
              <div className="mt-6">
                <Link 
                  href={`/profile/${mentorData.username}`}
                  className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition inline-block text-sm"
                >
                  <span>View Public Profile</span>
                  <FaExternalLinkAlt className="ml-2 text-sm" />
                </Link>
                <p className="mt-1.5 text-gray-400 text-xs">
                  This is how others see your profile
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="mt-6 bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-base font-semibold text-white mb-2">Personal Information</h3>
              <p className="text-gray-400 mb-3 text-sm">Update your personal details and profile picture</p>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition text-sm">
                Edit Details
              </button>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-base font-semibold text-white mb-2">Portfolio</h3>
              <p className="text-gray-400 mb-3 text-sm">Manage your work samples and portfolio items</p>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition text-sm">
                Edit Portfolio
              </button>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-base font-semibold text-white mb-2">Preferences</h3>
              <p className="text-gray-400 mb-3 text-sm">Set your notification and privacy preferences</p>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition text-sm">
                Manage Preferences
              </button>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-base font-semibold text-white mb-2">Account Security</h3>
              <p className="text-gray-400 mb-3 text-sm">Update your password and security settings</p>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition text-sm">
                Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
