import Link from 'next/link';
import { FaClock, FaTasks, FaBook, FaCalculator } from 'react-icons/fa';

export default function ProductivityHub() {
  // Simplified productivity tools data
  const productivityTools = [
    {
      id: 1,
      title: "Study Timer",
      icon: <FaClock className="text-xl text-blue-400" />,
      description: "Track your study time with Pomodoro technique"
    },
    {
      id: 2,
      title: "Task Manager",
      icon: <FaTasks className="text-xl text-green-400" />,
      description: "Organize assignments and track deadlines"
    },
    {
      id: 3,
      title: "Note Taking",
      icon: <FaBook className="text-xl text-yellow-400" />,
      description: "Create organized notes for your classes"
    },
    {
      id: 4,
      title: "GPA Calculator",
      icon: <FaCalculator className="text-xl text-purple-400" />,
      description: "Calculate and track your academic GPA"
    }
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {/* Simple Header */}
        <h1 className="text-2xl font-bold mb-6">Productivity Tools</h1>

        {/* Simplified Tools List */}
        <div className="space-y-4">
          {productivityTools.map(tool => (
            <Link 
              key={tool.id}
              href={`/productivity-hub/${tool.id}`}
              className="block"
            >
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="mr-4">{tool.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{tool.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
