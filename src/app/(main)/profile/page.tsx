'use client';

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ProfileHeader } from "@/components/mine";
import Gallery from "@/components/profile/Gallery";
import { UserInfo } from '@/components/UserInfo';

export default function ProfilePage() {
  const { user } = useUser();
  
  // Initial profile data
  const [profileData, setProfileData] = useState({
    username: user?.username || "Arts_guy",
    isVerified: true,
    school: "Dartmouth College",
    hourlyRate: 50,
    memberSince: "January 2023",
    profileImage: "/images/profile1.png",
    backgroundImage: "/images/dartmouth.png",
    bio: "Hello everyone, this is a little blurb about myself and this page tells me what kind of tutor I am. It shows what kind of tutor I am and what I am capable of. This site is supposed to build some trust between me and potential students.",
  });

  // Mock portfolio data
  const [portfolioItems, setPortfolioItems] = useState([
    {
      src: '/images/screenshot1.png',
      thumbnail: '/images/screenshot1.png',
      title: 'Skincare Website',
      description: 'A modern skincare product website with personalized recommendations',
      width: 1200,
      height: 800
    },
    {
      src: '/images/screenshot2.png',
      thumbnail: '/images/screenshot2.png',
      title: 'Social Media App',
      description: 'Mobile app for creative content sharing and community building',
      width: 1200,
      height: 800
    },
    {
      src: '/images/screenshot3.png',
      thumbnail: '/images/screenshot3.png',
      title: 'Pet Walker Service',
      description: 'Website for connecting pet owners with local pet walkers',
      width: 1200,
      height: 800
    },
    {
      src: '/images/screenshot4.png',
      thumbnail: '/images/screenshot4.png',
      title: 'Finance Dashboard',
      description: 'Personal finance management app with intuitive interface',
      width: 1200,
      height: 800
    }
  ]);

  // Handle edit profile
  const handleEditProfile = () => {
    // Your edit profile logic here
    console.log("Edit profile");
  };

  // Handle edit portfolio
  const handleEditPortfolio = () => {
    // Your edit portfolio logic here
    console.log("Edit portfolio");
  };
  
  // Handle add portfolio item
  const handleAddPortfolioItem = () => {
    // Your add portfolio item logic here
    console.log("Add portfolio item");
  };
  
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="relative">
          {/* Use the ProfileHeader component from mine folder */}
          <ProfileHeader
            username={profileData.username}
            isVerified={profileData.isVerified}
            school={profileData.school}
            hourlyRate={profileData.hourlyRate}
            timeOnPlatform={profileData.memberSince}
            profileImage={profileData.profileImage}
            backgroundImage={profileData.backgroundImage}
            showMessageButton={false}
          />
          
          {/* View Public Profile Button */}
          <div className="absolute top-4 right-4 sm:top-auto sm:bottom-4 sm:right-4 z-10">
            <Link 
              href={`/profile/${profileData.username}`}
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

        {/* Bio Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 relative">
            <div className="absolute top-6 left-0 w-4 h-4 bg-gray-800 transform -translate-x-1/2 rotate-45"></div>
            <p className="text-gray-300">{profileData.bio}</p>
            <button 
              onClick={handleEditProfile}
              className="mt-4 bg-[#2a3441] hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs"
            >
              Edit Bio
            </button>
          </div>
        </div>
        
        {/* Portfolio Gallery */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Work Samples</h2>
            <button 
              onClick={handleEditPortfolio}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition text-sm"
            >
              Edit Portfolio
            </button>
          </div>
          
          {/* Using the Gallery component with proper styling */}
          <Gallery 
            images={portfolioItems}
            title=""
          />
          
          {/* Add Portfolio Item Button - matching the Gallery grid styling */}
          <div className="mt-4 flex justify-center">
            <div 
              onClick={handleAddPortfolioItem}
              className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{ width: '100%', maxWidth: '300px', height: '169px' }}
            >
              <span className="text-5xl text-gray-500">+</span>
            </div>
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 bg-[#1a212c] rounded-xl border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-2">Personal Information</h3>
              <p className="text-gray-400 mb-4 text-sm">Update your personal details and profile picture</p>
              <button 
                onClick={handleEditProfile}
                className="bg-[#2a3441] hover:bg-gray-600 text-white px-4 py-2 rounded-md transition text-sm"
              >
                Edit Details
              </button>
            </div>
            
            <div className="p-6 bg-[#1a212c] rounded-xl border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-2">Portfolio</h3>
              <p className="text-gray-400 mb-4 text-sm">Manage your work samples and portfolio items</p>
              <button 
                onClick={handleEditPortfolio}
                className="bg-[#2a3441] hover:bg-gray-600 text-white px-4 py-2 rounded-md transition text-sm"
              >
                Edit Portfolio
              </button>
            </div>
            
            <div className="p-6 bg-[#1a212c] rounded-xl border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-2">Preferences</h3>
              <p className="text-gray-400 mb-4 text-sm">Set your notification and privacy preferences</p>
              <button className="bg-[#2a3441] hover:bg-gray-600 text-white px-4 py-2 rounded-md transition text-sm">
                Manage Preferences
              </button>
            </div>
            
            <div className="p-6 bg-[#1a212c] rounded-xl border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-2">Account Security</h3>
              <p className="text-gray-400 mb-4 text-sm">Update your password and security settings</p>
              <button className="bg-[#2a3441] hover:bg-gray-600 text-white px-4 py-2 rounded-md transition text-sm">
                Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
