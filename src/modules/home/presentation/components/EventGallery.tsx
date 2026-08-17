const dest1 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw.webp';
const dest2 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw2.webp';
const dest3 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw3.webp';
const dest4 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw4.webp';
const dest5 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw5.webp';
const dest6 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw6.webp';
const dest7 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw7.webp';
const dest8 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw8.webp';
const dest9 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw9.webp';
const dest10 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw10.webp';
const dest11 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw11.webp';
const dest12 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw12.webp';
const dest13 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw13.webp';
const dest14 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw14.webp';
const dest15 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852220/draw15.webp';

const COLS = [
  [dest1, dest2, dest3],
  [dest4, dest5, dest6],
  [dest7, dest8, dest9],
  [dest10, dest11, dest12],
  [dest13, dest14, dest15],
];

export function EventGallery() {
  return (
    <section className="py-16 bg-white overflow-hidden w-full">
      <div className="text-center mb-10 px-4">
        <p className="text-gray-500 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-1">
          Share your setup with
        </p>
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          #TiketinAjaEvents
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          {COLS.map((col, ci) => (
            <div key={ci} className={`flex flex-col gap-4${ci === 2 ? ' col-span-2 sm:col-span-1' : ''}`}>
              {col.map((src, ri) => (
                <img
                  key={ri}
                  src={src}
                  alt={`Concert ${ci * 3 + ri + 1}`}
                  loading="lazy"
                  className="w-full h-auto rounded-2xl hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
