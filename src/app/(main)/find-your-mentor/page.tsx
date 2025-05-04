import Mentor from '@/components/mentor/mentor';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function FindYourMentor() {
  // Mentor data
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
      username: 'ml_expert',
      school: 'Yale University',
      hourlyRate: 65,
      quote: 'Combining ML theory with practical implementation for real-world impact.',
      tags: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
      portfolio: {
        src: '/images/screenshot4.png',
        thumbnail: '/images/screenshot4.png',
        title: 'AI Analytics Dashboard',
        description: 'Data visualization platform powered by machine learning',
        width: 1200,
        height: 800
      }
    },
    {
      username: 'startup_guru',
      school: 'Brown University',
      hourlyRate: 75,
      quote: 'Helping founders navigate ideation to growth with battle-tested frameworks.',
      tags: ['Entrepreneurship', 'Venture Capital', 'Business Strategy', 'Product Management', 'Growth Hacking', 'Fundraising'],
      portfolio: {
        src: '/images/screenshot5.png',
        thumbnail: '/images/screenshot5.png',
        title: 'Startup Incubator Platform',
        description: 'Web platform connecting founders with investors and resources',
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
      portfolio: {
        src: '/images/screenshot6.png',
        thumbnail: '/images/screenshot6.png',
        title: 'Security Monitoring Tool',
        description: 'Network traffic analysis and threat detection dashboard',
        width: 1200,
        height: 800
      }
    }
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-4">Find Your Mentor</h1>
        
        {/* Search & Filter Section */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by skills, topics, or mentor name..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                <FaFilter className="mr-2" />
                <span>Filters</span>
              </button>
              
              <select className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="ratings">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Mentors Grid */}
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
        
        {/* Load More Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
            Load More Mentors
          </button>
        </div>
      </div>
    </div>
  );
}



