'use client';

import { useUserStore } from '@/store/user-store';

export function UserInfo() {
  const { username, role, interests, isLoaded } = useUserStore();
  
  if (!isLoaded) {
    return <div className="text-gray-400">Loading user info...</div>;
  }
  
  if (!username) {
    return <div className="text-gray-400">Not signed in or no username set</div>;
  }
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-2">User Information</h3>
      <p className="text-gray-300"><span className="text-gray-400">Username:</span> {username}</p>
      <p className="text-gray-300"><span className="text-gray-400">Role:</span> {role || 'Not set'}</p>
      {interests && interests.length > 0 && (
        <div className="mt-2">
          <p className="text-gray-400 mb-1">Interests:</p>
          <div className="flex flex-wrap gap-1">
            {interests.map((interest) => (
              <span key={interest} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 