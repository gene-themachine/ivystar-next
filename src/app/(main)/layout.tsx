'use client';

import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Link from 'next/link'
import { useUserStore } from '@/store/user-store'
import { useOnboardingStore } from '@/store/onboarding-store'
import { useEffect, useState } from 'react'
import OnboardingModal from '@/components/onboarding/OnboardingModal'
import { AnimatePresence, motion } from 'framer-motion'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoaded } = useUser();
  const setUserData = useUserStore((state) => state.setUserData);
  const resetUser = useUserStore((state) => state.resetUser);
  const checkOnboardingStatus = useOnboardingStore((state) => state.checkOnboardingStatus);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sync Clerk user data with our store
  useEffect(() => {
    if (isLoaded) {
      console.log(user);
      
      if (user) {
        // Extract relevant data from user
        setUserData({
          username: (user.unsafeMetadata?.username as string) || user.username || '',
          role: (user.unsafeMetadata?.role as 'mentor' | 'student') || null,
          interests: (user.unsafeMetadata?.interests as string[]) || [],
          profilePhoto: (user.unsafeMetadata?.profilePhoto as string) || '',
          projectPhoto: (user.unsafeMetadata?.projectPhoto as string) || '',
          projectDescription: (user.unsafeMetadata?.projectDescription as string) || '',
          college: (user.unsafeMetadata?.college as string) || undefined,
          gradeLevel: (user.unsafeMetadata?.gradeLevel as string) || undefined,
          isVerified: (user.unsafeMetadata?.isVerified as boolean) || undefined
        });
      } else {
        // Reset user data if there's no user
        resetUser();
      }
      
      // Check if we need to show onboarding
      if (user) {
        // Check if onboarding is complete
        const isOnboardingComplete = checkOnboardingStatus();
        
        if (!isOnboardingComplete) {
          setShowOnboarding(true);
        }
      }
    }
  }, [user, isLoaded, setUserData, resetUser, checkOnboardingStatus]);
  
  // Handle modal close with state management
  const handleCloseOnboarding = () => {
    setIsProcessing(true);
    setShowOnboarding(false);
    
    // Reset processing state after a delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  // Close mobile menu when clicking outside on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Prevent scrolling on body when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  return (
    <div className="flex h-full bg-gray-900 text-white relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar - always visible on desktop */}
      <div className="hidden md:block w-[240px] bg-gray-900 border-r border-gray-800 shadow-md h-full sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - only visible when menu is open */}
      <motion.aside 
        className="w-[240px] bg-gray-900 border-r border-gray-800 shadow-md h-full z-40 flex flex-col
                   fixed md:hidden top-0 left-0 transform-gpu transition-all duration-300 ease-in-out"
        initial={{ x: -240 }}
        animate={{ 
          x: isMobileMenuOpen ? 0 : -240,
          boxShadow: isMobileMenuOpen ? "0 0 15px rgba(0,0,0,0.5)" : "none"
        }}
        transition={{ duration: 0.3 }}
      >
        <Sidebar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
      </motion.aside>

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-900">
        <Header 
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        >
          <SignedIn>
            {/* No UserButton here */}
          </SignedIn>
        </Header>

        <main className="flex-1 overflow-y-auto bg-gray-950 relative">
          {children}
        </main>
      </div>
      
      {/* Onboarding Modal - Use AnimatePresence for transitions */}
      <AnimatePresence mode="wait">
        {showOnboarding && (
          <OnboardingModal 
            isOpen={showOnboarding} 
            onClose={handleCloseOnboarding} 
          />
        )}
      </AnimatePresence>
    </div>
  )
} 