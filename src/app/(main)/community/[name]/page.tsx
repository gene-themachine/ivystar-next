'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CommunityPage() {
  const params = useParams();
  const communityName = typeof params.name === 'string' ? params.name : '';
  const decodedName = decodeURIComponent(communityName);
  
  const [loading, setLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">{decodedName}</h1>
            <p className="text-gray-400 mb-8">
              This is a placeholder for the {decodedName} community page. Content will be implemented in a future update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
