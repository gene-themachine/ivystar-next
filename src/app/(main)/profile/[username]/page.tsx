import { notFound } from 'next/navigation';
import MentorProfile from '@/components/profile/MentorProfile';

// This would typically come from a database
const getMentorData = async (username: string) => {
  // For demo purposes, we'll return a mock mentor
  if (username === 'arts_guy' || username === 'Arts_guy') {
    return {
      username: 'Arts_guy',
      isVerified: true,
      school: 'Dartmouth College',
      hourlyRate: 50,
      joinedDate: '2023-01-15',
      bio: 'Hello everyone, this is a little blurb about myself and this page tells me what kind of tutor I am. It shows what kind of tutor I am and what I am capable of. This site is supposed to build some trust between me and potential students.',
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
  }
  
  // If user not found
  return null;
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
