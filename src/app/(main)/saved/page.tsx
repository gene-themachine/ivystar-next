'use client';

import { useState } from 'react';
import Post from '@/components/Post';
import Mentor from '@/components/mentor/mentor';

export default function Saved() {
  const [activeTab, setActiveTab] = useState('Mentors');
  
  // Sample post data
  const posts = [
    {
      id: '1',
      author: 'study_master42',
      isVerified: true,
      profileImage: '/images/profile1.png',
      institution: 'Harvard University',
      timeAgo: '2 hours ago',
      community: 'Study Tips',
      title: 'How I organized my study schedule for finals',
      content: 'I found that breaking down my study sessions into 25-minute blocks with 5-minute breaks (Pomodoro technique) helped me maintain focus throughout the day. I created a detailed schedule for each subject and stuck to it rigorously for the two weeks leading up to finals.',
      tags: ['studytips', 'productivity', 'finals'],
      likes: 42,
      comments: 12,
      isLiked: false,
      isSaved: true,
      hasMentorResponse: true,
      fieldOfStudy: 'Computer Science'
    },
    {
      id: '2',
      author: 'bio_researcher22',
      isVerified: false,
      profileImage: '/images/profile2.png',
      institution: 'Stanford University',
      timeAgo: '5 hours ago',
      community: 'Research Opportunities',
      title: 'Just got accepted to a summer research program!',
      content: "I'm excited to share that I'll be joining the Biology department's summer research program! The application process was competitive, but I focused my personal statement on how this opportunity aligns with my career goals in biotechnology.",
      tags: ['research', 'biology', 'achievement'],
      likes: 87,
      comments: 24,
      isLiked: true,
      isSaved: true,
      hasMentorResponse: false,
      fieldOfStudy: 'Biology'
    },
    {
      id: '3',
      author: 'academic_guide',
      isVerified: true,
      profileImage: '/images/profile3.png',
      institution: 'Princeton University',
      timeAgo: '1 day ago',
      community: 'Admissions',
      title: 'Tips for writing a compelling personal statement',
      content: "After helping several students with their applications, I've noticed that the most memorable personal statements tell a coherent story rather than listing achievements. Focus on a few significant experiences that shaped your perspective and connect them to your academic interests.",
      tags: ['admissions', 'personalstatement', 'advice'],
      likes: 156,
      comments: 43,
      isLiked: false,
      isSaved: true,
      hasMentorResponse: true,
      fieldOfStudy: 'English Literature'
    }
  ];

  // Sample saved mentors data using same format as find-your-mentor page
  const mentors = [
    {
      username: 'code_ninja',
      school: 'Harvard University',
      hourlyRate: 45,
      quote: 'Building application that solve real problems is my passion.',
      tags: ['Full Stack', 'React', 'Node.js', 'TypeScript', 'AWS', 'System Design'],
      profileImage: 'profile1.png',
      portfolio: {
        src: '/images/screenshot1.png',
        thumbnail: '/images/screenshot1.png',
        title: 'Skincare Website',
        description: 'A modern skincare product website with personalized recommendations',
        width: 1200,
        height: 800
      }
    },
    {
      username: 'algo_master',
      school: 'Princeton University',
      hourlyRate: 60,
      quote: 'Breaking complex problems into manageable components with proven strategies.',
      tags: ['Algorithms', 'Data Structures', 'Competitive Programming', 'Interview Prep', 'System Design', 'Python'],
      profileImage: 'profile2.png',
      portfolio: {
        src: '/images/screenshot2.png',
        thumbnail: '/images/screenshot2.png',
        title: 'Social Media App',
        description: 'Mobile app for creative content sharing and community building',
        width: 1200,
        height: 800
      }
    },
    {
      username: 'design_pro',
      school: 'Columbia University',
      hourlyRate: 55,
      quote: 'Guiding design from research to prototyping with evidence-based decisions.',
      tags: ['UX/UI Design', 'Product Design', 'User Research', 'Figma', 'Design Systems', 'Prototyping'],
      profileImage: 'profile3.png',
      portfolio: {
        src: '/images/screenshot3.png',
        thumbnail: '/images/screenshot3.png',
        title: 'Pet Walker Service',
        description: 'Website for connecting pet owners with local pet walkers',
        width: 1200,
        height: 800
      }
    },
    {
      username: 'cybersec_hacker',
      school: 'Dartmouth College',
      hourlyRate: 70,
      quote: 'Teaching offensive and defensive security tactics for robust system design.',
      tags: ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Network Security', 'Secure Coding'],
      profileImage: 'profile3.png',
      portfolio: {
        src: '/images/screenshot4.png',
        thumbnail: '/images/screenshot4.png',
        title: 'Finance Dashboard',
        description: 'Personal finance management app with intuitive interface',
        width: 1200,
        height: 800
      }
    }
  ];

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
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

        {/* Tab Content */}
        {activeTab === 'Posts' && (
          <div className="space-y-6">
            {posts.map(post => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        )}

        {activeTab === 'Mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor, index) => (
              <Mentor
                key={index}
                username={mentor.username}
                school={mentor.school}
                hourlyRate={mentor.hourlyRate}
                quote={mentor.quote}
                tags={mentor.tags}
                profileImage={mentor.profileImage}
                portfolio={mentor.portfolio}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
