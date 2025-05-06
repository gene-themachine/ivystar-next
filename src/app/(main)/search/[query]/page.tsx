'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Post from '@/components/Post'
import Mentor from '@/components/mentor/mentor'
import Community from '@/components/search/community'
import { motion } from 'framer-motion'

// Mock data for communities
interface CommunityType {
  id: string
  name: string
  memberCount: number
  description: string
  image: string
  tags: string[]
}

// Mock search results
const mockCommunities: CommunityType[] = [
  {
    id: 'cs-101',
    name: 'Computer Science 101',
    memberCount: 1423,
    description: 'A community for beginners learning computer science fundamentals',
    image: '/community-cs.png',
    tags: ['coding', 'beginners', 'computer-science']
  },
  {
    id: 'math-wizards',
    name: 'Math Wizards',
    memberCount: 823,
    description: 'Advanced mathematics discussions and problem solving',
    image: '/community-math.png',
    tags: ['mathematics', 'calculus', 'problem-solving']
  }
]

const mockPosts = [
  {
    id: 'post1',
    author: 'AlexJ',
    isVerified: true,
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    institution: 'MIT',
    timeAgo: '3 hours ago',
    community: 'Computer Science',
    title: 'Struggling with Data Structures',
    content: 'I\'m having trouble understanding binary trees and their implementations. Can someone recommend good resources or explain the concept in simple terms?',
    tags: ['algorithms', 'data-structures', 'help'],
    likes: 24,
    comments: 7,
    isLiked: false,
    isSaved: false,
    hasMentorResponse: true,
    fieldOfStudy: 'Computer Science'
  },
  {
    id: 'post2',
    author: 'SarahL',
    isVerified: false,
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    institution: 'Stanford',
    timeAgo: '1 day ago',
    community: 'Physics',
    title: 'Quantum Mechanics Question',
    content: 'Can someone explain the double-slit experiment in terms that would make sense to an undergraduate? I\'m struggling to grasp the wave-particle duality concept.',
    tags: ['quantum-physics', 'undergraduate'],
    likes: 15,
    comments: 3,
    isLiked: true,
    isSaved: true,
    hasMentorResponse: false,
    fieldOfStudy: 'Physics'
  }
]

const mockMentors = [
  {
    username: 'DrTaylor',
    school: 'Harvard University',
    hourlyRate: 45,
    tags: ['algorithms', 'data-structures', 'python', 'machine-learning'],
    profileImage: 'mentor1.jpg',
    bio: 'Helping computer science students bridge the gap between theory and practical applications.'
  },
  {
    username: 'ProfJones',
    school: 'Stanford University',
    hourlyRate: 55,
    tags: ['quantum-mechanics', 'electromagnetism', 'thermodynamics', 'astrophysics'],
    profileImage: 'mentor2.jpg',
    bio: 'Passionate about making complex physics concepts accessible to everyone.'
  }
]

// Sample mentors data (replace with API data)
const sampleMentors = [
  {
    id: '1',
    username: 'Alex Johnson',
    school: 'Stanford University',
    hourlyRate: 45,
    tags: ['Computer Science', 'Algorithms', 'Machine Learning', 'Python'],
    profileImage: '/images/mentors/mentor1.jpg',
    bio: 'Computer Science professor with expertise in algorithm design and machine learning.'
  },
  {
    id: '2',
    username: 'Dr. Emily Wong',
    school: 'MIT',
    hourlyRate: 60,
    tags: ['Physics', 'Quantum Mechanics', 'Mathematics', 'Research'],
    profileImage: '/images/mentors/mentor2.jpg',
    bio: 'Researcher in quantum physics with a passion for teaching complex theories in simple terms.'
  },
  // More sample mentors as needed
];

export default function SearchResultsPage() {
  const params = useParams()
  const query = typeof params.query === 'string' ? params.query : ''
  const decodedQuery = decodeURIComponent(query)
  
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)
  
  // Simulate fetching results
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Search results for "<span className="text-[#0387D0]">{decodedQuery}</span>"
          </h1>
          <p className="text-gray-400">Showing relevant communities, posts, and mentors</p>
        </div>
        
        {/* Tab Navigation - Similar to saved page */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'All' 
              ? 'text-white border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('All')}
          >
            All
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Communities' 
              ? 'text-white border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Communities')}
          >
            Communities
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Posts' 
              ? 'text-white border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Posts')}
          >
            Posts
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Mentors' 
              ? 'text-white border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Mentors')}
          >
            Mentors
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Communities Content */}
            {(activeTab === 'All' || activeTab === 'Communities') && (
              <div className={`${activeTab !== 'All' ? '' : 'mb-10'}`}>
                {activeTab !== 'All' && (
                  <h2 className="text-xl font-bold text-white mb-4">Communities</h2>
                )}
                
                {mockCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {mockCommunities.map(community => (
                      <Community
                        key={community.id}
                        id={community.id}
                        name={community.name}
                        memberCount={community.memberCount}
                        description={community.description}
                        image={community.image}
                        tags={community.tags}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No communities found</div>
                )}
                
                {mockCommunities.length > 0 && activeTab === 'All' && (
                  <div className="mb-4">
                    <Link href={`/search/communities/${query}`} className="text-[#0387D0] text-sm hover:underline">
                      View all community results →
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Posts Content */}
            {(activeTab === 'All' || activeTab === 'Posts') && (
              <div className={`${activeTab !== 'All' ? '' : 'mb-10'}`}>
                {activeTab !== 'All' && (
                  <h2 className="text-xl font-bold text-white mb-4">Posts</h2>
                )}
                
                {mockPosts.length > 0 ? (
                  <div className="space-y-6">
                    {mockPosts.map(post => (
                      <Post 
                        key={post.id}
                        id={post.id}
                        author={post.author}
                        isVerified={post.isVerified}
                        profileImage={post.profileImage}
                        institution={post.institution}
                        timeAgo={post.timeAgo}
                        community={post.community}
                        title={post.title}
                        content={post.content}
                        tags={post.tags}
                        likes={post.likes}
                        comments={post.comments}
                        isLiked={post.isLiked}
                        isSaved={post.isSaved}
                        hasMentorResponse={post.hasMentorResponse}
                        fieldOfStudy={post.fieldOfStudy}
                        onPostClick={(id) => console.log(`Clicked post ${id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No posts found</div>
                )}
                
                {mockPosts.length > 0 && activeTab === 'All' && (
                  <div className="mb-4">
                    <Link href={`/search/posts/${query}`} className="text-[#0387D0] text-sm hover:underline">
                      View all post results →
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Mentors Content */}
            {(activeTab === 'All' || activeTab === 'Mentors') && (
              <div>
                {activeTab !== 'All' && (
                  <h2 className="text-xl font-bold text-white mb-4">Mentors</h2>
                )}
                
                {mockMentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockMentors.map((mentor, index) => (
                      <Mentor
                        key={index}
                        username={mentor.username}
                        school={mentor.school}
                        hourlyRate={mentor.hourlyRate}
                        tags={mentor.tags}
                        profileImage={mentor.profileImage}
                        bio={mentor.bio}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No mentors found</div>
                )}
                
                {mockMentors.length > 0 && activeTab === 'All' && (
                  <div>
                    <Link href={`/search/mentors/${query}`} className="text-[#0387D0] text-sm hover:underline">
                      View all mentor results →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}