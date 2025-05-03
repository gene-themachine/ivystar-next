'use client';

import { useState } from 'react';
import { Gallery } from 'react-grid-gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Additional Lightbox plugins
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

interface PortfolioGalleryProps {
  images: PortfolioImage[];
  title?: string;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ 
  images, 
  title = "Work Samples" 
}) => {
  const [index, setIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  // Format the portfolio images for react-grid-gallery
  const galleryImages = images.map((image) => ({
    ...image,
    customOverlay: (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
        <span className="text-white text-lg font-medium px-3 py-1 rounded bg-black bg-opacity-60">
          {image.title || 'View'}
        </span>
      </div>
    ),
  }));

  // Format the portfolio images for the lightbox
  const lightboxImages = images.map((image) => ({
    src: image.src,
    title: image.title,
    description: image.description
  }));

  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
      
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <Gallery 
          images={galleryImages} 
          onClick={(index) => {
            setIndex(index);
            setOpen(true);
          }}
          enableImageSelection={false}
          rowHeight={200}
          margin={5}
        />
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

export default PortfolioGallery; 