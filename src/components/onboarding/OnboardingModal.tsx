'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'mentor' | 'student' | null;

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user } = useUser();
  
  const [step, setStep] = useState(1);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample interests - these can be adjusted or loaded from an API
  const interestOptions = [
    'Computer Science', 
    'Mathematics', 
    'Physics', 
    'Engineering',
    'Business', 
    'Medicine', 
    'Law', 
    'Arts',
    'Humanities',
    'Social Sciences',
    'Biology'
  ];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() !== '' && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1 && !userRole) {
      newErrors.role = 'Please select whether you are a mentor or student';
    }
    
    if (step === 2) {
      if (username.trim() === '') {
        newErrors.username = 'Username is required';
      } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    }
    
    if (step === 3 && interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save data to Clerk metadata
      if (user) {
        await user.update({
          // Use unsafeMetadata for non-public data or specific Clerk methods for publicMetadata
          unsafeMetadata: {
            role: userRole,
            username,
            interests
          }
        });
      }
      
      // Close modal after successful submission
      onClose();
      
      // Reload the page or navigate as needed
      router.refresh();
    } catch (error) {
      console.error('Error updating user metadata:', error);
      setErrors({ submit: 'Failed to save your information. Please try again.' });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-950 text-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden border border-gray-800"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 rounded-full p-2">
              <Image 
                src="/target.svg" 
                alt="Target icon" 
                width={28} 
                height={28} 
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Let's set up your account so you can get the most out of Ivystar
          </p>
        </div>

        {/* Step indicator */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${step >= 1 ? 'text-orange-500' : 'text-gray-500'}`}>Role</span>
            <span className={`text-sm ${step >= 2 ? 'text-orange-500' : 'text-gray-500'}`}>Username</span>
            <span className={`text-sm ${step >= 3 ? 'text-orange-500' : 'text-gray-500'}`}>Interests</span>
          </div>
          <div className="relative h-1 bg-gray-800 rounded-full">
            <motion.div 
              className="absolute h-full bg-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-6">Are you looking to teach or learn?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div 
                    className={`cursor-pointer rounded-lg p-6 text-center border transition-all ${
                      userRole === 'mentor' 
                        ? 'border-orange-500 bg-orange-500 bg-opacity-10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setUserRole('mentor')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-600 w-32 h-32 rounded-lg flex items-center justify-center">
                        <Image 
                          src="/mentor.svg"
                          alt="Mentor icon" 
                          width={80} 
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">Mentor</h4>
                  </motion.div>

                  <motion.div 
                    className={`cursor-pointer rounded-lg p-6 text-center border transition-all ${
                      userRole === 'student' 
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setUserRole('student')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-600 w-32 h-32 rounded-lg flex items-center justify-center">
                        <Image 
                          src="/student.svg"
                          alt="Student icon" 
                          width={80} 
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">Student</h4>
                  </motion.div>
                </div>
                {errors.role && (
                  <p className="text-red-500 mt-4 text-center">{errors.role}</p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-6">Choose a username</h3>
                <p className="text-gray-400 mb-4">
                  This will be your public identity on Ivystar. You can change this later.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 text-white focus:border-orange-500 focus:ring-orange-500 transition"
                      placeholder="Enter a username"
                    />
                    {errors.username && (
                      <p className="text-red-500 mt-1 text-sm">{errors.username}</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Your profile as it will appear:
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userRole === 'mentor' ? 'bg-orange-600' : 'bg-blue-600'}`}>
                        {username ? username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-medium">{username || 'Username'}</p>
                        <p className="text-sm text-gray-400">{userRole || 'Role'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-6">What are you interested in?</h3>
                <p className="text-gray-400 mb-4">
                  Select all that apply. This helps us connect you with relevant content and people.
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <motion.button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                          interests.includes(interest)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {interest}
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      className="flex-grow p-3 bg-gray-900 rounded-l-lg border border-gray-700 text-white focus:border-orange-500 focus:ring-orange-500 transition"
                      placeholder="Add custom interest"
                    />
                    <button
                      type="button"
                      onClick={addCustomInterest}
                      className="bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600 transition"
                    >
                      Add
                    </button>
                  </div>
                  
                  {interests.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Selected interests:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <div 
                            key={interest}
                            className="px-3 py-1 bg-gray-800 rounded-full text-sm font-medium flex items-center"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className="ml-2 text-gray-400 hover:text-white"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.interests && (
                    <p className="text-red-500 mt-1 text-sm">{errors.interests}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="px-6 mb-4">
            <p className="text-red-500">{errors.submit}</p>
          </div>
        )}

        {/* Footer with navigation buttons */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className={`px-5 py-2 rounded-lg ${
              step === 1 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-white bg-gray-800 hover:bg-gray-700 transition'
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={nextStep}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            {step < 3 ? 'Continue' : 'Complete Setup'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingModal;
