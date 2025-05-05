'use client';

import React from 'react';
import Image from 'next/image';

interface IntroductionProps {
  onContinue: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onContinue }) => {
  return (
    <div className="w-full mx-auto text-center py-5 px-4">
      <div className="flex justify-center mb-4">
        <Image 
          src="/25.svg" 
          alt="Ivystar" 
          width={60} 
          height={60} 
          className="invert"
        />
      </div>
      
      <h2 className="text-xl font-bold mb-3 text-white">
        Welcome to Ivystar
      </h2>
      
      <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700 mb-4 mx-auto max-w-md">
        <p className="text-gray-300 text-sm mb-2">
          A platform where learning happens in a safe and anonymous space.
        </p>
        <p className="text-gray-400 text-xs">
          If you're here to teach and share knowledge, join as a <span className="text-orange-400 font-medium">Mentor</span>. 
          If you're looking to learn and receive guidance, join as a <span className="text-blue-400 font-medium">Student</span>.
        </p>
      </div>
      
      {/* Role options with custom colors */}
      <div className="flex justify-center gap-3 mb-4">
        <div className="w-[160px] h-20 orange-section-3 rounded-md flex flex-col items-center justify-center p-2">
          <h3 className="text-white font-medium text-sm mb-1">Mentor</h3>
          <p className="text-gray-200 text-xs">I want to teach and share my expertise</p>
        </div>
        
        <div className="w-[160px] h-20 blue-section-3 rounded-md flex flex-col items-center justify-center p-2">
          <h3 className="text-white font-medium text-sm mb-1">Student</h3>
          <p className="text-gray-200 text-xs">I want to learn and receive guidance</p>
        </div>
      </div>
      
      <button
        onClick={onContinue}
        className="orange-section-2 hover:orange-section-3 text-white py-1.5 px-6 rounded-md font-medium transition-colors text-sm"
      >
        Continue
      </button>
    </div>
  );
};

export default Introduction;
