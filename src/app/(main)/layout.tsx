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
import { AnimatePresence } from 'framer-motion'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoaded } = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const checkOnboardingStatus = useOnboardingStore((state) => state.checkOnboardingStatus);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sync Clerk user data with our store
  useEffect(() => {
    if (isLoaded) {
      console.log(user);
      setUser(user || null);
      
      // Check if we need to show onboarding
      if (user) {
        // Check if onboarding is complete
        const isOnboardingComplete = checkOnboardingStatus();
        
        if (!isOnboardingComplete) {
          setShowOnboarding(true);
        }
      }
    }
  }, [user, isLoaded, setUser, checkOnboardingStatus]);
  
  // Handle modal close with state management
  const handleCloseOnboarding = () => {
    setIsProcessing(true);
    setShowOnboarding(false);
    
    // Reset processing state after a delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };
  
  return (
    <div className="flex h-full bg-gray-900 text-white relative">
      <aside className="w-[240px] bg-gray-900 border-r border-gray-800 shadow-md sticky top-0 h-full z-20 flex flex-col">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-900">
        <Header>
          <SignedOut>
          </SignedOut>
          <SignedIn>
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