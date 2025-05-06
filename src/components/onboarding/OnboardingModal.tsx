'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/store/user-store';
import { useUploadThing } from '@/lib/uploadthing';
import Flow1 from './flow1';
import Flow2 from './flow2';
import Flow3 from './flow3';
import Flow4 from './flow4';
import Flow5 from './flow5';
import Introduction from './Introduction';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'mentor' | 'student' | null;
type GradeLevel = string;

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const setUserData = useUserStore((state) => state.setUserData);
  const { startUpload } = useUploadThing("imageUploader");
  
  const [step, setStep] = useState(0); // Start at 0 for introduction
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [username, setUsername] = useState('');
  const [college, setCollege] = useState('');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('/default-profile.jpg');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [projectPhoto, setProjectPhoto] = useState('/default-project.jpg');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine which steps can be skipped
  const canSkipCurrentStep = () => {
    // Step 3 (interests) and Step 4 (photo) can be skipped
    return step === 3 || step === 4;
  };

  // Skip to final preview step
  const skipToPreview = () => {
    setStep(5);
  };

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

  // Sample photos for profile picture selection
  const profilePhotoOptions = [
    '/profile-placeholder-1.jpg',
    '/profile-placeholder-2.jpg',
    '/profile-placeholder-3.jpg',
    '/profile-placeholder-4.jpg'
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

  const selectProfilePhoto = (photo: string) => {
    setProfilePhoto(photo);
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
      
      if (userRole === 'mentor' && college.trim() === '') {
        newErrors.college = 'Please enter your college/university';
      }
      
      if (!gradeLevel) {
        newErrors.gradeLevel = 'Please select your education level';
      }
    }
    
    // For skippable steps, don't add errors
    if (step === 3 && interests.length === 0 && !canSkipCurrentStep()) {
      newErrors.interests = 'Please select at least one interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < 5) {
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
    if (isSubmitting) return; // Prevent multiple submissions
    
    try {
      setIsSubmitting(true);
      
      // Upload the photo to UploadThing if a new one was selected
      let finalProfilePhotoUrl = profilePhoto;
      
      if (photoFile) {
        try {
          const uploadResult = await startUpload([photoFile]);
          if (uploadResult && uploadResult[0]) {
            finalProfilePhotoUrl = uploadResult[0].url;
          }
        } catch (error) {
          console.error('Error uploading photo:', error);
          setErrors({ profilePhoto: 'Failed to upload photo. Please try again.' });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create the user metadata object
      const userMetadata: any = {
        username: username,
        role: userRole,
        interests
      };
      
      // Only add grade level if it's set
      if (gradeLevel) {
        userMetadata.gradeLevel = gradeLevel;
      }
      
      // Only add college if user is a mentor and it's set
      if (userRole === 'mentor' && college) {
        userMetadata.college = college;
      }
      
      // Explicitly set verification status to false for mentors
      if (userRole === 'mentor') {
        userMetadata.isVerified = false;
      }
      
      // Only add profilePhoto to metadata if it's not the default photo
      if (finalProfilePhotoUrl !== '/default-profile.jpg') {
        userMetadata.profilePhoto = finalProfilePhotoUrl;
      }
      
      // Update metadata in Clerk
      if (user) {
        await user.update({
          unsafeMetadata: userMetadata
        });
        
        // Save the same data to MongoDB
        try {
          // Prepare the data for MongoDB
          const mongoData = {
            clerkId: user.id,
            username,
            email: user.primaryEmailAddress?.emailAddress,
            role: userRole,
            interests,
            profilePhoto: finalProfilePhotoUrl !== '/default-profile.jpg' ? finalProfilePhotoUrl : undefined,
            college: userRole === 'mentor' ? college : undefined,
            gradeLevel,
            isVerified: userRole === 'mentor' ? false : undefined
          };
          
          // Save to MongoDB via API
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mongoData)
          });
          
          if (!response.ok) {
            throw new Error(`MongoDB save failed: ${response.statusText}`);
          }
          
          console.log('User data saved to MongoDB successfully');
        } catch (mongoError) {
          console.error('Error saving to MongoDB:', mongoError);
          // Don't fail the entire process if MongoDB save fails
          // Just log it and continue with Clerk data
        }
      }
      
      // Also update our local store with all relevant info
      setUserData({
        username,
        role: userRole,
        interests,
        profilePhoto: finalProfilePhotoUrl,
        college: userRole === 'mentor' ? college : undefined,
        gradeLevel,
        isVerified: userRole === 'mentor' ? false : undefined
      });
      
      // First close the modal
      onClose();
      
      // Then refresh the page after a short delay to ensure state updates are processed
      setTimeout(() => {
        router.refresh();
      }, 100);
      
    } catch (error) {
      console.error('Error updating user metadata:', error);
      setErrors({ submit: 'Failed to save your information. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleIntroductionComplete = () => {
    setShowIntroduction(false);
    setStep(1); // Move to flow1 after introduction
  };

  // Effect to set default grade level when role changes
  useEffect(() => {
    if (userRole === 'student') {
      setGradeLevel('High School');
      // Clear college field for students since we don't ask for it
      setCollege('');
    } else if (userRole === 'mentor') {
      setGradeLevel('College Student');
    }
  }, [userRole]);

  useEffect(() => {
    if (isLoaded && user) {
      // Register the user with default values when they first load the onboarding
      registerUserWithDefaults();
    }
  }, [isLoaded, user]);

  const registerUserWithDefaults = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error('Failed to register user with defaults');
      } else {
        console.log('User registered with default bio and hourly rate');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-950 text-white rounded-xl w-full max-w-3xl overflow-hidden border border-gray-800 max-h-[90vh]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Hide header and step indicator during introduction */}
        {!showIntroduction && (
          <>
            {/* Header */}
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 rounded-full p-2">
                  <Image 
                    src="/target.svg" 
                    alt="Target icon" 
                    width={24} 
                    height={24} 
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Complete Your Profile</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Set up your account to get the most out of Ivystar
                  </p>
                </div>
              </div>
            </div>

            {/* Step indicator */}
            <div className="px-5 py-3 border-b border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${step >= 1 ? 'text-orange-500' : 'text-orange-500 opacity-50'}`}>Role</span>
                <span className={`text-xs font-medium ${step >= 2 ? 'text-orange-500' : 'text-orange-500 opacity-50'}`}>Username</span>
                <span className={`text-xs font-medium ${step >= 3 ? 'text-orange-500' : 'text-orange-500 opacity-50'}`}>Interests</span>
                <span className={`text-xs font-medium ${step >= 4 ? 'text-orange-500' : 'text-orange-500 opacity-50'}`}>Photo</span>
                <span className={`text-xs font-medium ${step >= 5 ? 'text-orange-500' : 'text-orange-500 opacity-50'}`}>Preview</span>
              </div>
              <div className="relative h-1 bg-gray-800 rounded-full">
                <motion.div 
                  className="absolute h-full bg-orange-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </>
        )}

        {/* Step content - with variable height */}
        <div className={`${showIntroduction ? 'p-0' : 'p-5'} min-h-[400px] max-h-[calc(90vh-200px)] overflow-y-auto`}>
          <AnimatePresence mode="wait">
            {showIntroduction && (
              <Introduction 
                key="introduction"
                onContinue={handleIntroductionComplete}
              />
            )}
          
            {!showIntroduction && step === 1 && (
              <Flow1 
                key="flow1"
                userRole={userRole}
                setUserRole={setUserRole}
                errors={errors}
              />
            )}

            {step === 2 && (
              <Flow2 
                key="flow2"
                username={username}
                setUsername={setUsername}
                college={college}
                setCollege={setCollege}
                gradeLevel={gradeLevel}
                setGradeLevel={setGradeLevel}
                userRole={userRole}
                errors={errors}
              />
            )}

            {step === 3 && (
              <Flow3 
                key="flow3"
                interests={interests}
                toggleInterest={toggleInterest}
                customInterest={customInterest}
                setCustomInterest={setCustomInterest}
                addCustomInterest={addCustomInterest}
                errors={errors}
                interestOptions={interestOptions}
              />
            )}
          
            {step === 4 && (
              <Flow4 
                key="flow4"
                profilePhoto={profilePhoto}
                selectProfilePhoto={setProfilePhoto}
                errors={errors}
                profilePhotoOptions={profilePhotoOptions}
                setPhotoFile={setPhotoFile}
              />
            )}
          
            {step === 5 && (
              <Flow5 
                key="flow5"
                username={username}
                userRole={userRole}
                interests={interests}
                profilePhoto={profilePhoto}
                college={college}
                gradeLevel={gradeLevel}
                errors={errors}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="px-5 mb-2">
            <p className="text-red-500 text-center text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Footer with navigation buttons - hide during introduction */}
        {!showIntroduction && (
          <div className="px-5 py-4 border-t border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium min-w-[90px] ${
                  step === 1 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-white bg-gray-800 hover:bg-gray-700 transition'
                }`}
                disabled={step === 1}
              >
                Back
              </button>
              
              {canSkipCurrentStep() && (
                <button
                  type="button"
                  onClick={skipToPreview}
                  className="text-gray-400 hover:text-gray-300 transition text-xs ml-1"
                >
                  Skip to preview
                </button>
              )}
            </div>
            
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium min-w-[100px]"
            >
              {isSubmitting ? 'Saving...' : (step < 5 ? 'Continue' : 'Complete')}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OnboardingModal;