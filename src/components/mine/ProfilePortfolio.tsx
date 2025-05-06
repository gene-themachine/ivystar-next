'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Gallery from './Gallery';
import WorkSampleForm from './WorkSampleForm';
import { FaStar, FaRegStar } from 'react-icons/fa';

export interface WorkSample {
  id: string;
  title: string;
  summary: string;     // Brief description for previews
  description: string; // Detailed description for the lightbox view
  imageUrl: string;
  isHighlighted?: boolean; // New field to track highlighted project
}

interface ProfilePortfolioProps {
  workSamples: WorkSample[];
  onUpdateWorkSamples: (samples: WorkSample[]) => Promise<void>;
}

const ProfilePortfolio: React.FC<ProfilePortfolioProps> = ({
  workSamples,
  onUpdateWorkSamples
}) => {
  const [isAddingWorkSample, setIsAddingWorkSample] = useState(false);
  const [isEditingWorkSample, setIsEditingWorkSample] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Convert work samples to gallery format
  const galleryImages = workSamples.map(sample => ({
    src: sample.imageUrl,
    thumbnail: sample.imageUrl,
    title: sample.title,
    summary: sample.summary,         // Added brief summary field
    description: sample.description,  // Full description for the lightbox
    isHighlighted: sample.isHighlighted, // Add highlighted status to gallery
    width: 1200, // Default width
    height: 800  // Default height
  }));
  
  const handleAddWorkSample = async (sample: { 
    title: string; 
    summary: string;
    description: string; 
    imageUrl: string 
  }) => {
    try {
      setIsProcessing(true);
      
      // Create a new work sample with a unique ID
      const newSample: WorkSample = {
        id: Date.now().toString(), // Simple unique ID
        ...sample,
        isHighlighted: false // New project is not highlighted by default
      };
      
      // Add the new sample to the existing ones
      const updatedSamples = [...workSamples, newSample];
      
      // Save the updated samples
      await onUpdateWorkSamples(updatedSamples);
      
      // Close the form
      setIsAddingWorkSample(false);
    } catch (error) {
      console.error('Error adding work sample:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleEditWorkSample = async (sample: { 
    title: string; 
    summary: string;
    description: string; 
    imageUrl: string 
  }) => {
    if (!isEditingWorkSample) return;
    
    try {
      setIsProcessing(true);
      
      // Find the work sample being edited
      const updatedSamples = workSamples.map(existingSample => 
        existingSample.id === isEditingWorkSample
          ? { ...existingSample, ...sample } 
          : existingSample
      );
      
      // Save the updated samples
      await onUpdateWorkSamples(updatedSamples);
      
      // Close the form
      setIsEditingWorkSample(null);
    } catch (error) {
      console.error('Error editing work sample:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDeleteWorkSample = async (id: string) => {
    try {
      setIsProcessing(true);
      
      // Filter out the sample being deleted
      const updatedSamples = workSamples.filter(sample => sample.id !== id);
      
      // Save the updated samples
      await onUpdateWorkSamples(updatedSamples);
    } catch (error) {
      console.error('Error deleting work sample:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handler for toggling the highlighted status of a project
  const handleToggleHighlight = async (id: string) => {
    try {
      setIsProcessing(true);
      
      // Find the currently highlighted sample (if any)
      const currentlyHighlighted = workSamples.find(sample => sample.isHighlighted);
      
      // Update all samples - remove highlight from currently highlighted,
      // and add it to the newly highlighted one
      const updatedSamples = workSamples.map(sample => ({
        ...sample,
        isHighlighted: sample.id === id ? true : false
      }));
      
      // Save the updated samples
      await onUpdateWorkSamples(updatedSamples);
      
      // Show confirmation
      if (currentlyHighlighted?.id !== id) {
        console.log(`Project "${updatedSamples.find(s => s.id === id)?.title}" is now highlighted`);
      }
    } catch (error) {
      console.error('Error highlighting work sample:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Find the work sample being edited, if any
  const editingSample = isEditingWorkSample 
    ? workSamples.find(sample => sample.id === isEditingWorkSample) 
    : undefined;
    
  // Find the currently highlighted sample (if any)
  const highlightedSample = workSamples.find(sample => sample.isHighlighted);

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
      <div className="mt-10" id="portfolio-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Work Samples</h2>
          
          {!isAddingWorkSample && !isEditingWorkSample && (
            <button 
              onClick={() => setIsAddingWorkSample(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition text-sm"
              disabled={isProcessing}
            >
              Add Work Sample
            </button>
          )}
        </div>
        
        {/* Highlighted Project Section - only visible if there's a highlighted project */}
        {highlightedSample && !isAddingWorkSample && !isEditingWorkSample && (
          <div className="mb-8 bg-gray-800/60 p-4 rounded-xl border border-blue-800/30">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <FaStar className="text-yellow-500" size={18} />
              <h3 className="font-semibold">Highlighted Project</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/3 h-48 relative rounded-lg overflow-hidden">
                <img
                  src={highlightedSample.imageUrl}
                  alt={highlightedSample.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:w-2/3">
                <h4 className="text-lg font-medium text-white mb-1">
                  {highlightedSample.title}
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  {highlightedSample.summary}
                </p>
                <p className="text-gray-400 text-sm">
                  {highlightedSample.description}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isAddingWorkSample && (
          <WorkSampleForm 
            onSave={handleAddWorkSample}
            onCancel={() => setIsAddingWorkSample(false)}
          />
        )}
        
        {isEditingWorkSample && editingSample && (
          <WorkSampleForm 
            initialData={{
              title: editingSample.title,
              summary: editingSample.summary,
              description: editingSample.description,
              imageUrl: editingSample.imageUrl
            }}
            onSave={handleEditWorkSample}
            onCancel={() => setIsEditingWorkSample(null)}
          />
        )}
        
        {!isAddingWorkSample && !isEditingWorkSample && (
          <>
            {workSamples.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 mb-6">You haven't added any work samples yet.</p>
                <button 
                  onClick={() => setIsAddingWorkSample(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition text-sm"
                >
                  Add Your First Sample
                </button>
              </div>
            ) :
              <Suspense fallback={<div className="p-8 text-center">Loading gallery...</div>}>
                <Gallery images={galleryImages} />
                
                {/* Work sample management controls */}
                <div className="mt-6 bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <h3 className="font-medium mb-3">Manage Work Samples</h3>
                  <div className="space-y-2">
                    {workSamples.map(sample => (
                      <div key={sample.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{sample.title}</span>
                            {sample.isHighlighted && <FaStar className="text-yellow-500" size={16} title="Highlighted Project" />}
                          </div>
                          <span className="text-sm text-gray-400 block truncate">{sample.summary}</span>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button 
                            onClick={() => handleToggleHighlight(sample.id)}
                            className={`p-1.5 ${sample.isHighlighted ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            title={sample.isHighlighted ? "Remove highlight" : "Highlight this project"}
                            disabled={isProcessing}
                          >
                            {sample.isHighlighted ? <FaStar size={16} /> : <FaRegStar size={16} />}
                          </button>
                          <button 
                            onClick={() => setIsEditingWorkSample(sample.id)}
                            className="text-blue-400 hover:text-blue-300 p-1.5"
                            disabled={isProcessing}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteWorkSample(sample.id)}
                            className="text-red-400 hover:text-red-300 p-1.5"
                            disabled={isProcessing}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Suspense>
            }
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ProfilePortfolio; 