import { useState } from 'react';
import { X } from 'lucide-react';

interface EventDetailHeroProps {
  name: string;
  categoryLabel: string;
  imageUrl?: string;
  gradientClass: string;
}

export function EventDetailHero({
  name,
  categoryLabel,
  imageUrl,
  gradientClass,
}: EventDetailHeroProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-900 aspect-video sm:aspect-21/9">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity" 
            onClick={() => setIsPreviewOpen(true)}
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${gradientClass} flex items-center justify-center p-8 text-center text-white`}>
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-md text-xs font-black px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                {categoryLabel}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black">{name}</h2>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Image Preview Modal */}
      {isPreviewOpen && imageUrl && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewOpen(false);
            }}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          
          <img 
            src={imageUrl} 
            alt={name} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
}
