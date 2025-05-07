'use client'

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SignUpPage() {
  // Animation variants with enhanced transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96] // Custom easing
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1, 
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.7, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 1.2, 
        ease: "easeOut", 
        delay: 0.7 
      }
    },
    hover: {
      scale: 1.08,
      rotate: 5,
      transition: { 
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96] 
      }
    }
  };

  const floatingIconVariants = {
    hidden: { opacity: 0, y: 30, rotate: -5 },
    visible: { 
      opacity: 0.5, 
      y: 0, 
      rotate: 0,
      transition: { 
        duration: 1.5, 
        ease: "easeOut", 
        delay: 1.5 
      }
    },
    floating: {
      y: [0, -15, 0],
      x: [0, 7, 0],
      rotate: [0, 6, 0],
      transition: {
        y: {
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        },
        x: {
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        },
        rotate: {
          duration: 7,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/backgroundphoto.jpg" 
          alt="Background" 
          fill
          priority
          className="object-cover"
        />
        {/* Semi-transparent overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/80"></div>
      </div>
      
      <div className="relative z-10 flex h-full">
        {/* Left Content Area */}
        <div className="hidden md:flex md:w-3/5 relative">
          {/* Floating icon in bottom-right corner */}
          <motion.div 
            className="absolute right-12 bottom-8"
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
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                Connect with mentors
              </motion.div>
              <motion.div 
                className="text-6xl font-bold text-white drop-shadow-lg -mt-1" 
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                who've been
              </motion.div>
              <motion.div 
                className="text-6xl font-bold text-white drop-shadow-lg -mt-1" 
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                where you're going.
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Right Column - Sign Up Form */}
        <motion.div 
          className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="max-w-md mx-auto w-full backdrop-blur-sm bg-black/70 p-8 rounded-xl transform scale-90 origin-center">
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
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
              <motion.h1 
                className="text-4xl font-bold text-white"
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                Ivystar
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-gray-400 mb-8 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              A mentor-student network, built on anonymity and trust.
            </motion.p>
            
            {/* Clerk SignUp component */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <SignUp 
                appearance={{
                  baseTheme: dark,
                  elements: {
                    formButtonPrimary: 'bg-orange-500 hover:bg-orange-600 text-sm normal-case',
                    socialButtonsBlockButton: 'border-gray-700 text-gray-300',
                    socialButtonsBlockButtonText: 'text-gray-300',
                    footerActionLink: 'text-orange-500',
                    card: 'bg-transparent border-gray-800',
                    dividerLine: 'bg-gray-700',
                    dividerText: 'text-gray-400',
                    formFieldInput: 'bg-black/50 text-white border-gray-700',
                    formFieldLabel: 'text-gray-300',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-gray-400'
                  }
                }}
                signInUrl="/sign-in"
                redirectUrl="/"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 