import { Link } from 'react-router-dom';
import logoSvg from '../../assets/logo.svg';
import bcaLogo from '../../assets/payments/bca.svg';
import bniLogo from '../../assets/payments/bni.svg';
import briLogo from '../../assets/payments/bri.svg';
import bsiLogo from '../../assets/payments/bsi.svg';
import cimbLogo from '../../assets/payments/cimb.svg';
import jagoLogo from '../../assets/payments/jago.svg';
import jeniusLogo from '../../assets/payments/jenius.svg';
import seabankLogo from '../../assets/payments/seabank.svg';
import alloLogo from '../../assets/payments/allo.svg';
import superbankLogo from '../../assets/payments/superbank.svg';

const PAYMENTS = [
  { name: 'BCA', logo: bcaLogo },
  { name: 'BNI', logo: bniLogo },
  { name: 'BRI', logo: briLogo },
  { name: 'BSI', logo: bsiLogo },
  { name: 'Allo Bank', logo: alloLogo },
  { name: 'CIMB', logo: cimbLogo },
  { name: 'Bank Jago', logo: jagoLogo },
  { name: 'Jenius', logo: jeniusLogo },
  { name: 'SeaBank', logo: seabankLogo },
  { name: 'Superbank', logo: superbankLogo },
];

export function Footer() {
  return (
    <footer className="bg-[#0B132B] text-gray-300 w-full border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logoSvg} alt="Tiketin Aja Logo" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-xl tracking-tight text-white">
                Tiketin<span className="text-[#0064D2]">Aja</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Platform booking tiket events #1 di Indonesia. Nikmati pembelian tiket yang cepat, aman, dan tanpa antrian membingungkan untuk semua event favoritmu.
            </p>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Semua Events
                </Link>
              </li>
              <li>
                <Link to="/events?cat=Pop" className="hover:text-white transition-colors">
                  Konser Pop & Rock
                </Link>
              </li>
              <li>
                <Link to="/events?cat=Festival" className="hover:text-white transition-colors">
                  Musik Festival
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Pusat Bantuan FAQ
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Cara Beli Tiket
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Syarat & Ketentuan
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Kebijakan Privasi
                </span>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Metode Pembayaran
            </h4>
            <div className="grid grid-cols-5 gap-1.5">
              {PAYMENTS.map((pm) => (
                <div
                  key={pm.name}
                  className="bg-white p-1 rounded-lg flex items-center justify-center h-8 shadow-sm hover:scale-105 transition-transform"
                  title={pm.name}
                >
                  <img src={pm.logo} alt={pm.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar matching user mockup */}
      <div className="bg-[#070D1F] border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Copyright {new Date().getFullYear()} Tiketin Aja. All Rights Reserved.
          </p>

          {/* Social Media Icons with colored round backgrounds matching mockup */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-[#3B5998] hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-[#1DA1F2] hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Youtube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Youtube"
              className="w-9 h-9 rounded-full bg-[#FF0000] hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
