import Link from 'next/link';
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

export default function Events() {
  // Mock events data - simplified
  const events = [
    {
      id: 1,
      title: "College Admissions Workshop",
      date: "October 15, 2023",
      location: "Virtual Event",
      description: "Join our expert advisors for tips and strategies on crafting standout college applications."
    },
    {
      id: 2,
      title: "Ivy League Panel Discussion",
      date: "November 5, 2023",
      location: "Dartmouth College, Hanover, NH",
      description: "Hear from current students and alumni from various Ivy League schools about their experiences."
    },
    {
      id: 3,
      title: "Essay Writing Masterclass",
      date: "November 20, 2023",
      location: "Virtual Event",
      description: "Learn the art of crafting compelling personal statements and supplemental essays."
    },
    {
      id: 4,
      title: "Financial Aid & Scholarships Seminar",
      date: "December 8, 2023",
      location: "Boston Convention Center, Boston, MA",
      description: "Navigate the complex world of college financing, FAFSA applications, and scholarships."
    }
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {/* Simple Header */}
        <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>

        {/* Simple Events List */}
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              
              <div className="flex items-center text-gray-400 mb-2">
                <FaCalendar className="mr-2" />
                <span>{event.date}</span>
              </div>
              
              <div className="flex items-center text-gray-400 mb-3">
                <FaMapMarkerAlt className="mr-2" />
                <span>{event.location}</span>
              </div>
              
              <p className="text-gray-300 mb-3">{event.description}</p>
              
              <Link 
                href={`/events/${event.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
