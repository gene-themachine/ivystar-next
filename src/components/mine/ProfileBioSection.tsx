'use client';

import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

interface ProfileBioSectionProps {
  bio: string;
  isEditing: boolean;
  school: string;
  editForm: {
    bio: string;
    school: string;
    hourlyRate?: number;
  };
  onEditClick: () => void;
  onFormChange: (field: 'bio' | 'school' | 'hourlyRate', value: string | number) => void;
  role?: 'mentor' | 'student';
}

const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({
  bio,
  isEditing,
  school,
  editForm,
  onEditClick,
  onFormChange,
  role = 'student'
}) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">About</h2>
        {!isEditing && (
          <button 
            onClick={onEditClick}
            className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs flex items-center"
          >
            <FaEdit className="mr-1" /> Edit Profile
          </button>
        )}
      </div>
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 relative">
        <div className="absolute top-6 left-0 w-4 h-4 bg-gray-800 transform -translate-x-1/2 rotate-45"></div>
        {isEditing ? (
          <div>
            {role === 'mentor' && (
              <>
                <div className="mb-4">
                  <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-1">
                    School/College/University
                  </label>
                  <input
                    type="text"
                    id="college"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.school}
                    onChange={(e) => onFormChange('school', e.target.value)}
                  />
                </div>
                {/* Hourly rate editing temporarily removed
                <div className="mb-4">
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-300 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    min="1"
                    step="1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.hourlyRate}
                    onChange={(e) => onFormChange('hourlyRate', parseInt(e.target.value))}
                  />
                </div>
                */}
              </>
            )}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                id="bio"
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editForm.bio}
                onChange={(e) => onFormChange('bio', e.target.value)}
              ></textarea>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">{bio}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileBioSection; 