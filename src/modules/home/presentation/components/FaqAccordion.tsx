import { ChevronDown } from 'lucide-react';
import { FAQS } from '../../constants/homeData';

const faqImg = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851180/Faq.webp';

export function FaqAccordion() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 text-center lg:text-left">
          <img src={faqImg} alt="FAQ Illustration" loading="lazy" className="w-64 max-w-full mx-auto lg:mx-0 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className="text-gray-500 text-sm">
            Punya pertanyaan seputar cara kerja antrian, pembayaran, atau e-ticket? Temukan jawabannya di sini.
          </p>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-gray-900 text-base list-none select-none">
                <span>{faq.q}</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 ml-4 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </summary>
              <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
