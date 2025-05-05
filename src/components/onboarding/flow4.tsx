'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Flow4Props {
  profilePhoto: string;
  selectProfilePhoto: (photo: string) => void;
  errors: Record<string, string>;
  profilePhotoOptions: string[];
  setPhotoFile: (file: File | null) => void;
}

const Flow4: React.FC<Flow4Props> = ({ 
  profilePhoto, 
  selectProfilePhoto, 
  errors,
  profilePhotoOptions,
  setPhotoFile
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a local preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Pass the file back to parent component for later upload
    setPhotoFile(file);
    
    // Set temporary local URL for preview
    selectProfilePhoto(url);
  }, [selectProfilePhoto, setPhotoFile]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-semibold mb-3 text-center">Profile Photo</h3>
      <p className="text-gray-400 mb-6 text-center text-base">
        Choose a profile photo or upload your own.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        {/* Preview of selected photo */}
        <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden">
          <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden border-4 border-blue-600 flex items-center justify-center group">
            {(previewUrl || profilePhoto !== '/default-profile.jpg') ? (
              <Image 
                src={previewUrl || profilePhoto} 
                alt="Profile photo preview" 
                fill 
                className="object-cover rounded-full"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              onClick={triggerFileInput}
            >
              <span className="text-white text-sm font-medium">Change Photo</span>
            </div>
          </div>
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        
        {/* Upload button */}
        <button
          type="button"
          onClick={triggerFileInput}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Select Profile Photo
        </button>
        
        <div className="text-center text-sm text-gray-400 max-w-md">
          You can upload a JPEG, PNG, or GIF file (max 4MB).
        </div>
        
        <div className="text-center text-sm text-blue-400 max-w-md">
          Please don't upload a personal photo. Choose an image that reflects your interests or personality instead.
        </div>
        
        {errors.profilePhoto && (
          <p className="text-red-500 text-sm">{errors.profilePhoto}</p>
        )}
      </div>
    </motion.div>
  );
};

export default Flow4;
