'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type UserRole = 'mentor' | 'student' | null;
type GradeLevel = string;

interface Flow2Props {
  username: string;
  setUsername: (username: string) => void;
  college: string;
  setCollege: (college: string) => void;
  gradeLevel: GradeLevel;
  setGradeLevel: (level: GradeLevel) => void;
  userRole: UserRole;
  errors: Record<string, string>;
}

const Flow2: React.FC<Flow2Props> = ({ username, setUsername, college, setCollege, gradeLevel, setGradeLevel, userRole, errors }) => {
  // Different grade level options based on role
  const [gradeLevelOptions, setGradeLevelOptions] = useState<string[]>([]);
  
  // Update grade level options when user role changes
  useEffect(() => {
    if (userRole === 'student') {
      setGradeLevelOptions([
        'Middle School',
        'High School',
        'College',
        'Other'
      ]);
      // Set Middle School as default for students
      if (!gradeLevel || gradeLevel === '') {
        setGradeLevel('Middle School');
      }
    } else if (userRole === 'mentor') {
      setGradeLevelOptions([
        'College Student',
        'Master\'s Student',
        'PhD',
        'Professional',
      ]);
      // Set College Student as default for mentors
      if (!gradeLevel || gradeLevel === '') {
        setGradeLevel('College Student');
      }
    }
    
    // Reset grade level if it's not in the new options
    if (userRole && gradeLevelOptions.length > 0 && !gradeLevelOptions.includes(gradeLevel)) {
      setGradeLevel(gradeLevelOptions[0] || '');
    }
  }, [userRole, gradeLevel, gradeLevelOptions, setGradeLevel]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <h3 className="text-2xl font-semibold mb-3 text-center">Set up your profile</h3>
      <p className="text-gray-400 mb-6 text-center text-sm">
        This will be your public identity on Ivystar.
      </p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 text-white text-base focus:border-orange-500 focus:ring-orange-500 transition"
            placeholder="Enter a username"
          />
          {errors.username && (
            <p className="text-red-500 mt-2 text-sm">{errors.username}</p>
          )}
        </div>
        
        {userRole === 'mentor' && (
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-2">
              School/College/University
            </label>
            <input
              type="text"
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 text-white text-base focus:border-orange-500 focus:ring-orange-500 transition"
              placeholder="Enter your college/university"
            />
            {errors.college && (
              <p className="text-red-500 mt-2 text-sm">{errors.college}</p>
            )}
          </div>
        )}
        
        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-300 mb-2">
            {userRole === 'student' ? 'Education Level' : 'Education Level'}
          </label>
          <select
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 text-white text-base focus:border-orange-500 focus:ring-orange-500 transition"
          >
            {gradeLevelOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.gradeLevel && (
            <p className="text-red-500 mt-2 text-sm">{errors.gradeLevel}</p>
          )}
        </div>
        
        <div className="bg-gray-900 p-5 rounded-lg border border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Preview:
          </h4>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${userRole === 'mentor' ? 'bg-orange-600' : 'bg-blue-600'}`}>
              {username ? username.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-medium text-lg">{username || 'Username'}</p>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400">
                  {userRole === 'mentor' ? 'Mentor' : userRole === 'student' ? 'Student' : 'Role'}
                </p>
                {userRole === 'mentor' && college && (
                  <p className="text-sm text-gray-300">{college}</p>
                )}
                <p className="text-sm text-gray-300">{gradeLevel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Flow2;
