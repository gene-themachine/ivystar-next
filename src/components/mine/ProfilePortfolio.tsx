'use client';

import { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Gallery from './Gallery';

interface PortfolioItem {
  src: string;
  thumbnail: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

interface ProfilePortfolioProps {
  portfolioItems: PortfolioItem[];
  onEditPortfolio: () => void;
  onAddPortfolioItem: () => void;
}

const ProfilePortfolio: React.FC<ProfilePortfolioProps> = ({
  portfolioItems,
  onEditPortfolio,
  onAddPortfolioItem
}) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="mt-10 p-8 text-center bg-gray-800 rounded-lg">
          <h3 className="text-xl mb-4">Unable to load gallery</h3>
          <p className="mb-4">There was a problem loading the gallery component.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Retry
          </button>
        </div>
      }
    >
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Work Samples</h2>
          <button 
            onClick={onEditPortfolio}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition text-sm"
          >
            Edit Portfolio
          </button>
        </div>
        
        <Suspense fallback={<div className="p-8 text-center">Loading gallery...</div>}>
          {/* Using the Gallery component with proper styling */}
          <Gallery 
            images={portfolioItems}
            title=""
          />
        </Suspense>
        
        {/* Add Portfolio Item Button - matching the Gallery grid styling */}
        <div className="mt-4 flex justify-center">
          <div 
            onClick={onAddPortfolioItem}
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center hover:opacity-90 transition-opacity"
            style={{ width: '100%', maxWidth: '300px', height: '169px' }}
          >
            <span className="text-5xl text-gray-500">+</span>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfilePortfolio; 