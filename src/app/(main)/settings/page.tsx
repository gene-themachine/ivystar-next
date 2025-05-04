'use client';

import { UserInfo } from '@/components/UserInfo';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UserInfo />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-2">Settings</h3>
          <p className="text-gray-400 mb-4">
            You can update your profile information from the onboarding modal.
          </p>
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
} 