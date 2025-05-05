// src/components/Sidebar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { useUserStore } from '@/store/user-store'

// Define the type for unsafeMetadata
interface UserMetadata {
  username?: string;
  role?: 'mentor' | 'student';
  interests?: string[];
  major?: string;
  school?: string;
  profilePhoto?: string;
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, isLoaded } = useUser()
  const { username: storeUsername } = useUserStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Cast unsafeMetadata to our custom type
  const metadata = user?.unsafeMetadata as UserMetadata | undefined

  // Get username from different sources with fallbacks
  const displayUsername = storeUsername || metadata?.username || user?.username || user?.firstName || "User"
  
  // Get profile photo from metadata (uploaded to UploadThing) or fallback to Clerk's default
  const profilePhotoUrl = metadata?.profilePhoto || user?.imageUrl
  
  // Get user role with fallback
  const userRole = metadata?.role || 'student'
  console.log("Sidebar user role from Clerk:", userRole) // Debug user role

  const handleLogout = () => {
    setIsMenuOpen(false)
  }

  return (
    <motion.div 
      className={`h-full pt-0 px-5 pb-5 flex flex-col bg-gray-900 backdrop-blur-sm`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mt-[-30px] mb-2">
        <Link href="/">
          <div className="flex justify-center items-center">
            <Image 
              src="/ivystar-logo.png" 
              alt="Ivystar Logo" 
              width={300} 
              height={150} 
              priority
              className="h-auto"
            />
          </div>
        </Link>
      </div>
      
      <motion.div 
        className={`mb-6 ${inter.variable}`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.button 
          className="w-full flex items-center justify-center border border-gray-700 py-2 px-3 rounded-lg text-gray-200 font-medium hover:bg-gray-800 transition-all duration-150 ease-out shadow-sm hover:shadow group"
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/new-post')}
        >
          <svg 
            className="w-4 h-4 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Post
        </motion.button>
      </motion.div>

      <nav className={`space-y-1 flex-grow overflow-y-auto custom-scrollbar ${inter.variable}`}>
        {[
          { path: '/', name: 'Home', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          )},
          { path: '/messages', name: 'Messages', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )},
          { path: '/find-your-mentor', name: 'Find your mentor', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          )},
          { path: '/events', name: 'Events', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          )},
          { path: '/productivity-hub', name: 'Productivity Hub', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          )},
          { path: '/saved', name: 'Saved', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        ].map((item) => (
          <motion.div 
            key={item.path}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(item.path)}
            onHoverEnd={() => setIsHovered(null)}
            transition={{ duration: 0.2, type: "tween" }}
          >
            <Link 
              href={item.path} 
              className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-400 hover:bg-gray-800 hover:text-gray-100 group ${
                pathname === item.path 
                  ? 'bg-gray-800 text-white border-l-4 border-blue-500'
                  : 'border-l-4 border-transparent'
              }`}
            >
              <div 
                className={`w-4 h-4 mr-2 ${pathname === item.path ? 'stroke-[2.4px]' : 'stroke-2'}`}
              >
                {item.icon}
              </div>
              <span className={pathname === item.path ? 'font-medium' : ''}>
                {item.name}
              </span>
              {pathname === item.path && (
                <div className="ml-auto h-2 w-2 rounded-full bg-blue-400" />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {isLoaded && user ? (
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="relative" ref={menuRef}>
            <div 
              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-all duration-150 ease-out cursor-pointer group"
              onClick={() => router.push('/profile')}
            >
              <div 
                className="w-10 h-10 rounded-full bg-gray-800 mr-3 flex items-center justify-center text-gray-300 overflow-hidden border border-gray-700 shadow-sm"
              >
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt={displayUsername as string} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-200 truncate">
                  {displayUsername}
                </div>
                <div className="text-sm truncate mt-0.5">
                  {user.publicMetadata?.school ? (
                    <span className="text-gray-400">
                      {`${user.publicMetadata.major || 'Student'} @ ${user.publicMetadata.school}`}
                    </span>
                  ) : (
                    <span className={userRole === 'mentor' 
                      ? 'inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-medium border border-orange-500 text-orange-400 bg-orange-950/20' 
                      : 'inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-medium border border-blue-500 text-blue-400 bg-blue-950/20'
                    }>
                      {userRole === 'mentor' ? 'Mentor' : 'Student'}
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-150 ease-out"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigating to profile when clicking this button
                  setIsMenuOpen(!isMenuOpen);
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </motion.button>
            </div>
            
            {isMenuOpen && (
              <div 
                className="absolute right-0 bottom-12 w-32 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 border border-gray-700"
              >
                <SignOutButton>
                  <button 
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 font-medium"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
