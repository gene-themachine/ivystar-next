'use client';

import React from 'react';
import Image from 'next/image';

interface IntroductionProps {
  onContinue: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onContinue }) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-6 px-8">
      <div className="flex justify-center mb-4">
        <Image 
          src="/25.svg" 
          alt="Ivystar" 
          width={90} 
          height={90} 
          className="invert"
        />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 text-white">
        Welcome to Ivystar
      </h2>
      
      <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700 mb-6 mx-auto max-w-2xl">
        <p className="text-gray-300 text-xl mb-3">
          A platform where learning happens in a safe and anonymous space.
        </p>
        <p className="text-gray-400 text-lg">
          If you're here to teach and share knowledge, join as a <span className="text-orange-400 font-semibold">Mentor</span>. 
          If you're looking to learn and receive guidance, join as a <span className="text-blue-400 font-semibold">Student</span>.
        </p>
      </div>
      
      {/* Role options with custom colors */}
      <div className="flex justify-center gap-10 mb-6">
        <div className="w-[270px] h-32 orange-section-3 rounded-xl flex flex-col items-center justify-center p-4 shadow-lg">
          <h3 className="text-white font-semibold text-2xl mb-2">Mentor</h3>
          <p className="text-gray-200 text-lg">I want to teach and share my expertise</p>
        </div>
        
        <div className="w-[270px] h-32 blue-section-3 rounded-xl flex flex-col items-center justify-center p-4 shadow-lg">
          <h3 className="text-white font-semibold text-2xl mb-2">Student</h3>
          <p className="text-gray-200 text-lg">I want to learn and receive guidance</p>
        </div>
      </div>
      
      <button
        onClick={onContinue}
        className="orange-section-2 hover:orange-section-3 text-white py-2 px-10 rounded-xl font-semibold transition-colors text-xl shadow-md"
      >
        Continue
      </button>
    </div>
  );
};

export default Introduction;
