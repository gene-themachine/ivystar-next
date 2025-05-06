import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
  size?: number;
  className?: string;
}

const ProfileImage = ({ src, alt, size = 56, className = '' }: ProfileImageProps) => {
  const [error, setError] = useState(false);
  const firstLetter = alt ? alt.charAt(0).toUpperCase() : 'U';

  // Log the src when the component mounts or when src changes
  useEffect(() => {
    if (src) {
      console.log(`ProfileImage component for ${alt} received src:`, src);
    } else {
      console.log(`ProfileImage component for ${alt} received null/undefined src`);
    }
  }, [src, alt]);

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      // Simple validation to check if it looks like a URL
      return url && (
        url.startsWith('http://') || 
        url.startsWith('https://') || 
        url.startsWith('/')
      );
    } catch {
      return false;
    }
  };

  // Determine if we should render an image or fallback
  const shouldShowImage = src && !error && isValidUrl(src);

  // Common classes for both image and fallback
  const containerClasses = `rounded-full overflow-hidden flex-shrink-0 ${className}`;
  
  if (shouldShowImage) {
    return (
      <div className={containerClasses} style={{ width: size, height: size }}>
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="rounded-full object-cover w-full h-full"
          onError={(e) => {
            console.error(`Error loading profile image for ${alt}:`, src);
            setError(true);
          }}
          unoptimized
        />
      </div>
    );
  }

  // Fallback to initial
  return (
    <div 
      className={`${containerClasses} flex items-center justify-center bg-gray-800 text-white font-bold`}
      style={{ width: size, height: size }}
    >
      {firstLetter}
    </div>
  );
};

export default ProfileImage; 