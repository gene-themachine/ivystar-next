'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

type UserRole = 'mentor' | 'student' | null;

interface Flow1Props {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  errors: Record<string, string>;
}

const Flow1: React.FC<Flow1Props> = ({ userRole, setUserRole, errors }) => {
  const [hoverMentor, setHoverMentor] = useState(false);
  const [hoverStudent, setHoverStudent] = useState(false);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h3 className="text-2xl font-semibold mb-6 text-center">Are you looking to teach or learn?</h3>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <motion.div 
          className={`group relative cursor-pointer rounded-xl p-6 text-center border transition-all ${
            userRole === 'mentor' 
              ? 'border-orange-500 orange-section-3' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onClick={() => setUserRole('mentor')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setHoverMentor(true)}
          onHoverEnd={() => setHoverMentor(false)}
        >
          <div className="flex justify-center mb-4">
            <div className="orange-section-2 w-28 h-28 rounded-xl flex items-center justify-center">
              <Image 
                src="/mentor.svg"
                alt="Mentor icon" 
                width={64} 
                height={64}
                className="object-contain"
              />
            </div>
          </div>
          <h4 className="text-xl font-bold">{userRole === 'mentor' ? <span className="text-white">Mentor</span> : 'Mentor'}</h4>
          <p className={`mt-2 font-medium text-base transition-all duration-300 ${
            userRole === 'mentor' 
              ? 'text-white' 
              : 'text-orange-300 group-hover:text-orange-200'
          }`}>Share your knowledge</p>
          
          {/* Mentor hover tooltip */}
          <motion.div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 orange-section-2 text-white px-4 py-2 rounded-lg shadow-lg z-10 text-sm font-medium w-max"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: hoverMentor ? 1 : 0,
              y: hoverMentor ? 0 : 10,
              pointerEvents: hoverMentor ? 'auto' : 'none'
            }}
            transition={{ duration: 0.2 }}
          >
            Help students succeed by sharing your expertise
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 orange-section-2"></div>
          </motion.div>
        </motion.div>

        <motion.div 
          className={`group relative cursor-pointer rounded-xl p-6 text-center border transition-all ${
            userRole === 'student' 
              ? 'border-blue-500 blue-section-3' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onClick={() => setUserRole('student')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setHoverStudent(true)}
          onHoverEnd={() => setHoverStudent(false)}
        >
          <div className="flex justify-center mb-4">
            <div className="blue-section-2 w-28 h-28 rounded-xl flex items-center justify-center">
              <Image 
                src="/student.svg"
                alt="Student icon" 
                width={64} 
                height={64}
                className="object-contain"
              />
            </div>
          </div>
          <h4 className="text-xl font-bold">{userRole === 'student' ? <span className="text-white">Student</span> : 'Student'}</h4>
          <p className={`mt-2 font-medium text-base transition-all duration-300 ${
            userRole === 'student' 
              ? 'text-white' 
              : 'text-blue-300 group-hover:text-blue-200'
          }`}>Find mentors to learn from</p>
          
          {/* Student hover tooltip */}
          <motion.div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 blue-section-2 text-white px-4 py-2 rounded-lg shadow-lg z-10 text-sm font-medium w-max"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: hoverStudent ? 1 : 0,
              y: hoverStudent ? 0 : 10,
              pointerEvents: hoverStudent ? 'auto' : 'none'
            }}
            transition={{ duration: 0.2 }}
          >
            Connect with mentors to enhance your learning journey
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 blue-section-2"></div>
          </motion.div>
        </motion.div>
      </div>
      {errors.role && (
        <p className="text-red-500 mt-4 text-center text-sm">{errors.role}</p>
      )}
    </motion.div>
  );
};

export default Flow1;
