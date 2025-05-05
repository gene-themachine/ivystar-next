'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { FaExternalLinkAlt, FaTimes, FaSave, FaEdit } from 'react-icons/fa';

interface ProfileActionsProps {
  isEditing: boolean;
  isUploading: boolean;
  username: string;
  backgroundInputRef: React.RefObject<HTMLInputElement>;
  onBackgroundChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTriggerBackgroundInput: () => void;
  onCancelEdit: () => void;
  onSaveProfile: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  isUploading,
  username,
  backgroundInputRef,
  onBackgroundChange,
  onTriggerBackgroundInput,
  onCancelEdit,
  onSaveProfile
}) => {
  return (
    <>
      {/* Edit Background Button (only when editing) */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={onTriggerBackgroundInput}
            className="bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex items-center"
          >
            <FaEdit className="mr-2" />
            Change Background
          </button>
          <input
            type="file"
            ref={backgroundInputRef}
            onChange={onBackgroundChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      )}
      
      {/* View Public Profile Button */}
      <div className="absolute top-4 right-4 sm:top-auto sm:bottom-4 sm:right-4 z-10">
        {isEditing ? (
          <div className="flex space-x-2">
            <button 
              onClick={onCancelEdit}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              disabled={isUploading}
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button 
              onClick={onSaveProfile}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <Link 
              href={`/profile/${username}`}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition inline-block text-sm"
            >
              <span>View Public Profile</span>
              <FaExternalLinkAlt className="ml-2 text-sm" />
            </Link>
            <p className="mt-1.5 text-gray-400 text-xs">
              This is how others see your profile
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileActions; 