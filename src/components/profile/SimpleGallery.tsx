'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/captions.css';

interface PortfolioImage {
  src: string;
  thumbnail: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
}

interface SimpleGalleryProps {
  images: PortfolioImage[];
  title?: string;
}

const SimpleGallery: React.FC<SimpleGalleryProps> = ({ images, title = "Work Samples" }) => {
  const [index, setIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  // Format the portfolio images for the lightbox
  const lightboxImages = images.map((image) => ({
    src: image.src,
    title: image.title,
    description: image.description
  }));

  return (
    <div className="mx-auto max-w-4xl">
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
      
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((image, idx) => (
            <div 
              key={idx} 
              className="relative cursor-pointer overflow-hidden rounded-lg aspect-video group"
              onClick={() => {
                setIndex(idx);
                setOpen(true);
              }}
            >
              <Image
                src={image.thumbnail}
                alt={image.title || `Portfolio item ${idx + 1}`}
                width={image.width}
                height={image.height}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-medium px-3 py-1 rounded bg-black bg-opacity-0 group-hover:bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.title || 'View'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lightbox for portfolio images */}
      <Lightbox
        open={open}
        index={index}
        close={() => setOpen(false)}
        slides={lightboxImages}
        plugins={[Captions, Zoom]}
        captions={{ descriptionTextAlign: 'center' }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
};

export default SimpleGallery; 