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
      portfolio: [
        {
          src: '/screenshots/screenshot1.png',
          thumbnail: '/screenshots/screenshot1.png',
          title: 'Skincare Website',
          description: 'A modern skincare product website with personalized recommendations',
          width: 1200,
          height: 800
        },
        {
          src: '/screenshots/screenshot2.png',
          thumbnail: '/screenshots/screenshot2.png',
          title: 'Social Media App',
          description: 'Mobile app for creative content sharing and community building',
          width: 1200,
          height: 800
        },
        {
          src: '/screenshots/screenshot3.png',
          thumbnail: '/screenshots/screenshot3.png',
          title: 'Pet Walker Service',
          description: 'Website for connecting pet owners with local pet walkers',
          width: 1200,
          height: 800
        },
        {
          src: '/screenshots/screenshot4.png',
          thumbnail: '/screenshots/screenshot4.png',
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
  params: {
    username: string
  }
}

export default async function MentorProfilePage({ params }: Props) {
  // Extract username from params to avoid the async params issue
  const { username } = params;
  
  const mentorData = await getMentorData(username);
  
  if (!mentorData) {
    notFound();
  }
  
  return <MentorProfile {...mentorData} />;
}
