import { notFound } from 'next/navigation';
import MentorProfile from '@/components/profile/MentorProfile';

// This would typically come from a database
const getMentorData = async (username: string) => {
  // For demo purposes, we'll return mentor data for any username
  // Create a mock profile using the given username
  return {
    username: username,
    isVerified: true,
    school: 'Dartmouth College',
    hourlyRate: 50,
    joinedDate: '2023-01-15',
    bio: `I'm ${username}, a tutor passionate about helping students achieve their goals. With a strong background in my field, I provide personalized tutoring sessions to ensure each student receives the guidance they need to succeed.`,
    profileImage: '/images/profile1.png',
    backgroundImage: '/images/dartmouth.png',
    portfolio: [
      {
        src: '/images/screenshot1.png',
        thumbnail: '/images/screenshot1.png',
        title: 'Skincare Website',
        description: 'A modern skincare product website with personalized recommendations',
        width: 1200,
        height: 800
      },
      {
        src: '/images/screenshot2.png',
        thumbnail: '/images/screenshot2.png',
        title: 'Social Media App',
        description: 'Mobile app for creative content sharing and community building',
        width: 1200,
        height: 800
      },
      {
        src: '/images/screenshot3.png',
        thumbnail: '/images/screenshot3.png',
        title: 'Pet Walker Service',
        description: 'Website for connecting pet owners with local pet walkers',
        width: 1200,
        height: 800
      },
      {
        src: '/images/screenshot4.png',
        thumbnail: '/images/screenshot4.png',
        title: 'Finance Dashboard',
        description: 'Personal finance management app with intuitive interface',
        width: 1200,
        height: 800
      }
    ]
  };
};

type Props = {
  // mark params as a Promise
  params: Promise<{ username: string }>;
}

export default async function MentorProfilePage({ params }: Props) {
  // await the params promise before using .username
  const { username } = await params;
  
  const mentorData = await getMentorData(username);
  
  if (!mentorData) {
    notFound();
  }
  
  return <MentorProfile {...mentorData} />;
}
