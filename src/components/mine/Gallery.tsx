'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

interface GalleryImage {
  src: string;
  thumbnail: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
}

interface GalleryProps {
  images: GalleryImage[];
  title?: string;
}

// Define the expected slide type for the render function
interface LightboxSlide {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Convert the images to the format expected by the lightbox
  const lightboxSlides = images.map(image => ({
    src: image.src,
    width: image.width,
    height: image.height,
    title: image.title,
    description: image.description,
  }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-video">
              <Image
                src={image.thumbnail}
                alt={image.title || `Gallery image ${index + 1}`}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
              />
            </div>
            {image.title && (
              <div className="p-3">
                <h3 className="font-medium text-white">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-300 mt-1">{image.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox using yet-another-react-lightbox */}
      <Lightbox
        open={lightboxOpen}
        index={currentImageIndex}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        plugins={[Zoom]}
        zoom={{ 
          maxZoomPixelRatio: 5,  // Higher zoom ratio for deeper zooming
          zoomInMultiplier: 2,   
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true     // Allow scroll to zoom
        }}
        carousel={{ 
          padding: 40,  // Add padding around the carousel
          spacing: 20   // Add spacing between slides
        }}
        styles={{ 
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
          slide: { padding: '30px' } // Add padding inside each slide
        }}
        render={{
          slide: ({ slide }: { slide: LightboxSlide }) => {
            return (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%',
                height: '100%',
                padding: '40px',
                boxSizing: 'border-box'
              }}>
                {/* Image container - smaller with whitespace */}
                <div style={{
                  width: '60%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '30px', // Add padding around image
                  boxSizing: 'border-box'
                }}>
                  <img
                    src={slide.src}
                    alt={slide.alt || ""}
                    style={{
                      maxWidth: '80%',     // Smaller image with whitespace
                      maxHeight: '80%',    // Smaller image with whitespace
                      objectFit: 'contain',
                      margin: 'auto',
                      display: 'block',
                      pointerEvents: 'auto'
                    }}
                  />
                </div>
                
                {/* Info container (right side) */}
                <div style={{
                  width: '30%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '40px 30px',
                  overflowY: 'auto',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                  boxSizing: 'border-box'
                }}>
                  {slide.title && (
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      margin: '0 0 24px 0',
                      color: 'white'
                    }}>
                      {slide.title}
                    </h2>
                  )}
                  {slide.description && (
                    <p style={{ 
                      fontSize: '16px',
                      lineHeight: '1.8',
                      margin: 0,
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default Gallery;
