'use client';

interface ProfileAccountSettingsProps {
  onEditProfile: () => void;
  onEditPortfolio: () => void;
}

const ProfileAccountSettings: React.FC<ProfileAccountSettingsProps> = ({
  onEditProfile,
  onEditPortfolio
}) => {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 bg-[#1a212c] rounded-xl border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-2">Personal Information</h3>
          <p className="text-gray-400 mb-4 text-sm">Update your personal details and profile picture</p>
          <button 
            onClick={onEditProfile}
            className="bg-[#2a3441] hover:bg-gray-600 text-white px-4 py-2 rounded-md transition text-sm"
          >
            Edit Details
          </button>
        </div>
        
        <div className="p-6 bg-[#1a212c] rounded-xl border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-2">Portfolio</h3>
          <p className="text-gray-400 mb-4 text-sm">Manage your work samples and portfolio items</p>
          <button 
            onClick={onEditPortfolio}
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
  );
};

export default ProfileAccountSettings; 