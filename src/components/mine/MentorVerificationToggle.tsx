'use client';

import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface MentorVerificationToggleProps {
  isVerified: boolean;
  onToggleVerification: (newStatus: boolean) => Promise<void>;
  mentorName: string;
}

const MentorVerificationToggle: React.FC<MentorVerificationToggleProps> = ({
  isVerified,
  onToggleVerification,
  mentorName
}) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    try {
      setIsPending(true);
      setError(null);
      await onToggleVerification(!isVerified);
    } catch (err) {
      setError('Failed to update verification status. Please try again.');
      console.error('Error toggling verification:', err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Mentor Verification</h3>
          <p className="text-gray-400 text-sm mt-1">
            Toggle verification status for {mentorName}
          </p>
        </div>
        <div className="flex items-center">
          <span className="mr-3 text-sm font-medium text-gray-300">
            {isVerified ? 'Verified' : 'Not Verified'}
          </span>
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isVerified ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isVerified ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-800 rounded-lg p-4">
        <div className="flex items-start">
          {isVerified ? (
            <FaCheckCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
          ) : (
            <FaTimesCircle className="text-gray-500 text-xl flex-shrink-0 mt-0.5" />
          )}
          <div className="ml-3">
            <h4 className="text-white font-medium">
              {isVerified ? 'Verified Mentor Status' : 'Unverified Status'}
            </h4>
            <p className="text-gray-400 text-sm mt-1">
              {isVerified
                ? 'This mentor has been verified and will display a verification badge on their profile.'
                : 'This mentor is not verified and will not display a verification badge.'}
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
};

export default MentorVerificationToggle; 