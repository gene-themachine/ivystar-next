import Mentor from './components/mentor';

export default function FindYourMentor() {
  // Mentor data
  const mentors = [
    {
      username: 'code_ninja',
      school: 'Harvard University',
      hourlyRate: 45,
      quote: 'Building application that solve real problems is my passion. .',
      tags: ['Full Stack', 'React', 'Node.js', 'TypeScript', 'AWS', 'System Design'],
      profileImage: 'profile1.png'
    },
    {
      username: 'algo_master',
      school: 'Princeton University',
      hourlyRate: 60,
      quote: 'Breaking complex problems into manageable components with proven strategies.',
      tags: ['Algorithms', 'Data Structures', 'Competitive Programming', 'Interview Prep', 'System Design', 'Python'],
      profileImage: 'profile2.png'
    },
    {
      username: 'design_pro',
      school: 'Columbia University',
      hourlyRate: 55,
      quote: 'Guiding design from research to prototyping with evidence-based decisions.',
      tags: ['UX/UI Design', 'Product Design', 'User Research', 'Figma', 'Design Systems', 'Prototyping'],
      profileImage: 'profile3.png'
    },
    {
      username: 'ml_expert',
      school: 'Yale University',
      hourlyRate: 65,
      quote: 'Combining ML theory with practical implementation for real-world impact.',
      tags: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision']
    },
    {
      username: 'startup_guru',
      school: 'Brown University',
      hourlyRate: 75,
      quote: 'Helping founders navigate ideation to growth with battle-tested frameworks.',
      tags: ['Entrepreneurship', 'Venture Capital', 'Business Strategy', 'Product Management', 'Growth Hacking', 'Fundraising']
    },
    {
      username: 'cybersec_hacker',
      school: 'Dartmouth College',
      hourlyRate: 70,
      quote: 'Teaching offensive and defensive security tactics for robust system design.',
      tags: ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Network Security', 'Secure Coding']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Find Your Mentor</h1>
        <p className="text-gray-600 mb-4">Connect with experienced professionals who can guide you through projects, provide career advice, and help you develop essential skills.</p>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-base font-medium mb-3">Find the Perfect Mentor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Field of Study</label>
              <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                <option>All Fields</option>
                <option>Computer Science</option>
                <option>Business & Entrepreneurship</option>
                <option>Design & UX</option>
                <option>Engineering</option>
                <option>Data Science</option>
                <option>Academic Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Support Type</label>
              <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                <option>Any Type</option>
                <option>Project Guidance</option>
                <option>Technical Skills</option>
                <option>Career Development</option>
                <option>Academic Support</option>
                <option>Interview Preparation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Meeting Frequency</label>
              <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                <option>Any Frequency</option>
                <option>Weekly Check-ins</option>
                <option>Bi-weekly Sessions</option>
                <option>Monthly Guidance</option>
                <option>On-demand Support</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-gray-800 text-white py-2 px-4 rounded-full text-sm">
              Find Mentors
            </button>
          </div>
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Available Mentors</h2>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">Sort by:</span>
            <select className="text-sm border border-gray-200 rounded-lg p-1.5">
              <option>Relevance</option>
              <option>Availability</option>
              <option>Experience Level</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentors.map((mentor, index) => (
            <Mentor
              key={index}
              username={mentor.username}
              school={mentor.school}
              hourlyRate={mentor.hourlyRate}
              quote={mentor.quote}
              tags={mentor.tags}
              profileImage={mentor.profileImage}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm hover:bg-gray-50">
            Show More Mentors
          </button>
        </div>
      </section>
    </div>
  )
}



