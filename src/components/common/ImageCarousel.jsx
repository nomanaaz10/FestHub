import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

export function ImageCarousel({ images = [], altTitle = "Gallery Image", aspectRatio = "aspect-video" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full ${aspectRatio} rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-slate-500`}>
        <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
        <span className="text-sm font-medium">No gallery images provided</span>
      </div>
    );
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image View */}
      <div className={`relative w-full ${aspectRatio} rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group shadow-lg`}>
        <img
          src={images[currentIndex]}
          alt={`${altTitle} - ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Gradient overlay on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg opacity-80 hover:opacity-100 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg opacity-80 hover:opacity-100 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setIsFullscreen(true)}
          aria-label="View Fullscreen"
          className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Index counter tag */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white/90">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-105'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={images[currentIndex]}
            alt={altTitle}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />

          {images.length > 1 && (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={prevImage}
                className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm font-semibold text-slate-300">
                {currentIndex + 1} of {images.length}
              </span>
              <button
                onClick={nextImage}
                className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
