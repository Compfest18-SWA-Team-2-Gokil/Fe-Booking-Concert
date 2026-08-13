import dest1 from '../../../../assets/destination/draw.png';
import dest2 from '../../../../assets/destination/draw2.png';
import dest3 from '../../../../assets/destination/draw3.png';
import dest4 from '../../../../assets/destination/draw4.png';
import dest5 from '../../../../assets/destination/draw5.png';
import dest6 from '../../../../assets/destination/draw6.png';
import dest7 from '../../../../assets/destination/draw7.png';
import dest8 from '../../../../assets/destination/draw8.png';
import dest9 from '../../../../assets/destination/draw9.png';
import dest10 from '../../../../assets/destination/draw10.png';
import dest11 from '../../../../assets/destination/draw11.png';
import dest12 from '../../../../assets/destination/draw12.png';
import dest13 from '../../../../assets/destination/draw13.png';
import dest14 from '../../../../assets/destination/draw14.png';
import dest15 from '../../../../assets/destination/draw15.png';

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
