// src/components/Header.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface HeaderProps {
  children?: React.ReactNode;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ 
  children,
  onMobileMenuToggle,
  isMobileMenuOpen
}: HeaderProps) {
  const router = useRouter();
  const placeholders = [
    "I'm curious about...",
    "I need a CS mentor...",
    "How do I prepare for college?",
    "Search topics, questions, or discussions..."
  ];
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { user, isLoaded } = useUser();
  
  useEffect(() => {
    // If animation is complete, keep the last placeholder
    if (animationComplete) {
      setCurrentPlaceholder("Search topics, questions, or discussions...");
      return;
    }
    
    let timeout: NodeJS.Timeout;
    
    if (isDeleting && currentPlaceholder === "") {
      // Done deleting, move to next placeholder
      setIsDeleting(false);
      
      // If we're at the end of placeholders, increment cycle count
      if (placeholderIndex === placeholders.length - 1) {
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        
        // Check if we've completed 2 cycles
        if (newCycleCount >= 2) {
          setAnimationComplete(true);
          // Set to the default search placeholder
          setCurrentPlaceholder("Search topics, questions, or discussions...");
          return;
        }
      }
      
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      return;
    }
    
    if (!isDeleting && currentPlaceholder === placeholders[placeholderIndex]) {
      // Fully typed, wait before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return;
    }
    
    timeout = setTimeout(() => {
      if (isDeleting) {
        // Remove one character
        setCurrentPlaceholder(prev => prev.slice(0, -1));
      } else {
        // Add one character
        setCurrentPlaceholder(prev => 
          placeholders[placeholderIndex].slice(0, prev.length + 1)
        );
      }
    }, isDeleting ? 50 : 80);
    
    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isDeleting, placeholderIndex, placeholders, cycleCount, animationComplete]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <header className={`w-full flex justify-between items-center px-4 md:px-10 py-4 bg-gray-900 shadow-md border-b border-gray-800`}>
      {/* Mobile menu toggle button */}
      {onMobileMenuToggle && (
        <button 
          className="md:hidden mr-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          onClick={onMobileMenuToggle}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      )}
      
      <div className="flex items-center flex-1 max-w-[1500px] mr-8">
        {/* Hide the navigation on mobile to save space */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/how-it-works" className="text-gray-300 font-medium hover:text-white relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-400 after:bottom-[-6px] after:left-0 after:transition-width after:duration-200 hover:after:w-full">
            How It Works
          </a>
          <a href="/about" className="text-gray-300 font-medium hover:text-white relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-400 after:bottom-[-6px] after:left-0 after:transition-width after:duration-200 hover:after:w-full">
            About
          </a>
        </nav>
        
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[500px] mx-auto md:mx-8">
          <input
            type="text"
            placeholder={currentPlaceholder}
            className="w-full py-3 px-5 border border-gray-700 rounded-full bg-gray-800 text-gray-200 transition-all focus:outline-none focus:border-gray-600 focus:bg-gray-800 focus:shadow-[0_0_0_3px_rgba(30,41,59,0.4)]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block">
          <div className="text-white font-medium text-lg">Aspirational</div>
          <div className="text-gray-400 text-xs font-semibold tracking-wide">HIGHER LEARNING</div>
        </div>
        
        {(isLoaded && !user) && (
          <a href="/sign-up" className="bg-blue-500 text-white font-medium py-2 px-4 sm:px-8 rounded-full transition-all hover:bg-blue-600 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md whitespace-nowrap">
            Get Started
          </a>
        )}
        {/* Clerk buttons passed as children will be rendered here */}
        {children}
      </div>
    </header>
  );
}
