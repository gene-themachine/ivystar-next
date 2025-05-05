'use client';

import { motion } from 'framer-motion';

interface Flow3Props {
  interests: string[];
  toggleInterest: (interest: string) => void;
  customInterest: string;
  setCustomInterest: (interest: string) => void;
  addCustomInterest: () => void;
  errors: Record<string, string>;
  interestOptions: string[];
}

const Flow3: React.FC<Flow3Props> = ({ 
  interests, 
  toggleInterest, 
  customInterest, 
  setCustomInterest, 
  addCustomInterest, 
  errors, 
  interestOptions 
}) => {
  const MAX_INTERESTS = 5;
  const hasReachedLimit = interests.length >= MAX_INTERESTS;
  
  // Wrapped toggle function to prevent adding more than the limit
  const handleToggleInterest = (interest: string) => {
    // If already selected, always allow removal
    if (interests.includes(interest)) {
      toggleInterest(interest);
      return;
    }
    
    // If not selected, only allow adding if under the limit
    if (!hasReachedLimit) {
      toggleInterest(interest);
    }
  };
  
  // Wrapped add custom interest function
  const handleAddCustomInterest = () => {
    if (!hasReachedLimit && customInterest.trim() !== '') {
      addCustomInterest();
    }
  };
  
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto max-h-[600px] flex flex-col"
    >
      <div className="flex-shrink-0">
        <h3 className="text-2xl font-semibold mb-3 text-center">What are you interested in?</h3>
        <p className="text-gray-400 mb-6 text-center text-base">
          Select up to {MAX_INTERESTS} topics that interest you.
        </p>
      </div>
      
      <div className="space-y-6 overflow-y-auto flex-grow pr-1">
        {/* Interest options in scrollable container */}
        <div className="flex flex-wrap gap-3 justify-center max-h-36 overflow-y-auto p-2 border border-gray-800 rounded-lg">
          {interestOptions.map((interest) => (
            <motion.button
              key={interest}
              type="button"
              onClick={() => handleToggleInterest(interest)}
              disabled={hasReachedLimit && !interests.includes(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                interests.includes(interest)
                  ? 'bg-orange-500 text-white'
                  : hasReachedLimit
                    ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: !hasReachedLimit || interests.includes(interest) ? 1.05 : 1 }}
              whileTap={{ scale: !hasReachedLimit || interests.includes(interest) ? 0.95 : 1 }}
            >
              {interest}
            </motion.button>
          ))}
        </div>
        
        {/* Custom interest input */}
        <div className="max-w-xl mx-auto">
          <div className="flex">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className={`flex-grow p-3 bg-gray-900 rounded-l-lg border border-gray-700 text-white text-base focus:border-orange-500 focus:ring-orange-500 transition ${
                hasReachedLimit ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              placeholder={hasReachedLimit ? "Maximum interests reached" : "Add custom interest"}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !hasReachedLimit) {
                  e.preventDefault();
                  handleAddCustomInterest();
                }
              }}
              disabled={hasReachedLimit}
            />
            <button
              type="button"
              onClick={handleAddCustomInterest}
              disabled={hasReachedLimit || customInterest.trim() === ''}
              className={`text-white px-4 py-3 rounded-r-lg text-base font-medium transition ${
                hasReachedLimit || customInterest.trim() === ''
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Selected interests */}
        {interests.length > 0 && (
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 max-w-lg mx-auto">
            <h4 className="text-xs font-medium text-gray-300 mb-2">
              Selected ({interests.length}/{MAX_INTERESTS}):
            </h4>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {interests.map((interest) => (
                <div 
                  key={interest}
                  className="px-2 py-1 bg-gray-800 rounded-full text-xs font-medium flex items-center"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    className="ml-1.5 text-gray-400 hover:text-white"
                    aria-label={`Remove ${interest}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {hasReachedLimit && (
          <p className="text-amber-500 text-xs text-center">
            Maximum of {MAX_INTERESTS} interests reached. Remove some to add different ones.
          </p>
        )}
        
        {errors.interests && (
          <p className="text-red-500 mt-2 text-center text-sm">{errors.interests}</p>
        )}
      </div>
    </motion.div>
  );
};

export default Flow3;
