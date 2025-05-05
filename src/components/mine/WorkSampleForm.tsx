'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useUploadThing } from '@/lib/uploadthing';

interface WorkSampleFormProps {
  onSave: (sample: {
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    summary: string;
    description: string;
    imageUrl: string;
  };
}

const WorkSampleForm: React.FC<WorkSampleFormProps> = ({ 
  onSave, 
  onCancel, 
  initialData 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("portfolioUploader");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Create a temporary preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageFile(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!summary.trim()) {
      setError('Please enter a brief summary');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a detailed description');
      return;
    }
    
    if (!imageFile && !imageUrl) {
      setError('Please upload a sample image');
      return;
    }
    
    try {
      setIsUploading(true);
      let finalImageUrl = imageUrl;
      
      // Upload the image if a new one was selected
      if (imageFile) {
        const uploadResult = await startUpload([imageFile]);
        if (uploadResult && uploadResult[0]) {
          finalImageUrl = uploadResult[0].url;
        } else {
          throw new Error('Failed to upload image');
        }
      }
      
      // Save the work sample
      onSave({
        title,
        summary,
        description,
        imageUrl: finalImageUrl
      });
      
    } catch (err) {
      setError('Failed to save work sample. Please try again.');
      console.error('Error saving work sample:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Work Sample' : 'Add Work Sample'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sample Image
          </label>
          
          <div className="flex flex-col items-center">
            {/* Image Preview */}
            <div 
              className="w-full max-w-md h-64 bg-gray-800 rounded-lg mb-4 overflow-hidden border border-gray-700 flex items-center justify-center relative"
            >
              {previewUrl ? (
                <Image 
                  src={previewUrl} 
                  alt="Work sample preview" 
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>No image selected</span>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition mb-2 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              {initialData ? 'Change Image' : 'Upload Image'}
            </button>
            
            <p className="text-xs text-gray-500">
              Accepts JPG, PNG or GIF (max 8MB)
            </p>
          </div>
        </div>
        
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-base focus:border-blue-500 focus:ring-blue-500 transition"
            placeholder="Enter work sample title"
          />
        </div>
        
        {/* Brief Summary Field */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
            Brief Summary
          </label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-base focus:border-blue-500 focus:ring-blue-500 transition"
            placeholder="Enter a short description (shown in preview)"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {summary.length}/100 characters - This will appear in the preview
          </p>
        </div>
        
        {/* Detailed Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Detailed Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-base focus:border-blue-500 focus:ring-blue-500 transition"
            placeholder="Enter a detailed description of your work sample"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be shown when someone clicks on your work sample
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkSampleForm; 