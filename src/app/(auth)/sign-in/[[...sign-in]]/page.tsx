'use client'

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SignInPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const blueRectVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.5 }
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: { duration: 0.3 }
    }
  };

  const floatingIconVariants = {
    hidden: { opacity: 0, y: 20, rotate: -5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { 
        duration: 1, 
        ease: "easeOut", 
        delay: 1.2 
      }
    },
    floating: {
      y: [0, -10, 0],
      rotate: [0, 5, 0],
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        },
        rotate: {
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column - Sign In Form */}
      <motion.div 
        className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-black text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto w-full">
          <motion.div 
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover="hover"
              initial="hidden"
              animate="visible"
              variants={iconVariants}
              className="text-white"
            >
              <Image 
                src="/book.svg" 
                alt="Book icon" 
                width={60} 
                height={60} 
                className="object-contain filter brightness-0 invert"
              />
            </motion.div>
            <h1 className="text-4xl font-bold text-white">Ivystar</h1>
          </motion.div>
          
          <motion.p 
            className="text-gray-400 mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A mentor-student network, built on anonymity and trust.
          </motion.p>
          
          {/* Clerk SignIn component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <SignIn 
              appearance={{
                baseTheme: dark,
                elements: {
                  formButtonPrimary: 'bg-teal-600 text-sm normal-case',
                  socialButtonsBlockButton: 'border-gray-700 text-gray-300',
                  socialButtonsBlockButtonText: 'text-gray-300',
                  footerActionLink: 'text-teal-500',
                  card: 'bg-black border-gray-800',
                  dividerLine: 'bg-gray-700',
                  dividerText: 'text-gray-400',
                  formFieldInput: 'bg-black text-white border-gray-700',
                  formFieldLabel: 'text-gray-300',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-gray-400'
                }
              }}
              signUpUrl="/sign-up"
              redirectUrl="/"
            />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right Column - Blue Rectangles */}
      <div className="hidden md:block md:w-3/5 relative overflow-hidden">
        {/* Blue rectangle sections with animations */}
        <motion.div 
          className="absolute inset-0 h-2/5 blue-section-1"
          variants={blueRectVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        ></motion.div>
        <motion.div 
          className="absolute inset-0 top-2/5 h-1/5 blue-section-2"
          variants={blueRectVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        ></motion.div>
        <motion.div 
          className="absolute inset-0 top-3/5 h-1/5 blue-section-3"
          variants={blueRectVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        ></motion.div>
        <motion.div 
          className="absolute inset-0 top-4/5 h-1/5 blue-section-4"
          variants={blueRectVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        ></motion.div>
        
        {/* Floating icon in bottom-right corner */}
        <motion.div 
          className="absolute right-12 bottom-8 z-10"
          initial="hidden"
          animate={["visible", "floating"]}
          variants={floatingIconVariants}
        >
          <Image 
            src="/planet.svg" 
            alt="Book icon" 
            width={100} 
            height={100} 
            className="object-contain filter brightness-0 invert"
          />
        </motion.div>
        
        {/* Text overlay with staggered animation */}
        <motion.div 
          className="absolute inset-0 pt-20 pb-16 pl-10 pr-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-white leading-tight">
            <motion.div 
              className="text-6xl font-bold text-white drop-shadow-lg" 
              variants={itemVariants}
            >
              Connect with mentors
            </motion.div>
            <motion.div 
              className="text-6xl font-bold text-white drop-shadow-lg -mt-1" 
              variants={itemVariants}
            >
              who've been
            </motion.div>
            <motion.div 
              className="text-6xl font-bold text-white drop-shadow-lg -mt-1" 
              variants={itemVariants}
            >
              where you're going.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 