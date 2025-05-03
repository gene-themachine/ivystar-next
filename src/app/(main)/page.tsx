import Post from '@/components/Post';

export default function Home() {
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
      isSaved: false,
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
      isSaved: false,
      hasMentorResponse: true,
      fieldOfStudy: 'English Literature'
    }
  ];

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="space-y-6">
          {posts.map(post => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  )
} 