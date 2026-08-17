import { FEATURES } from '../../constants/homeData';

export function WhyChooseUs() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Kenapa Memilih Tiketin Aja?
          </h2>
          <p className="text-gray-500 text-base mt-2">
            Pengalaman beli tiket konser terbaik dengan teknologi antrean modern & keamanan terjamin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center shadow-sm hover:bg-blue-100/80 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 group"
            >
              <div className="w-36 h-36 mx-auto mb-6 relative flex items-center justify-center">
                <img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
