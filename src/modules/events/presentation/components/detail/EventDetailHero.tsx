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
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-900 aspect-video sm:aspect-[21/9]">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center p-8 text-center text-white`}>
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-md text-xs font-black px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
              {categoryLabel}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">{name}</h2>
          </div>
        </div>
      )}
    </div>
  );
}
