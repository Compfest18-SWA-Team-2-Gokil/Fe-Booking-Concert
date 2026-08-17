import { type LucideIcon, Flame, Mic, Disc, Radio, PartyPopper, Sparkles, Tag } from 'lucide-react';
const drawKit1 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851672/DrawKit1.webp';
const drawKit2 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851672/DrawKit2.webp';
const drawKit3 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851672/DrawKit3.webp';

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface PromoBanner {
  id: number;
  title: string;
  subtitle: string;
  code: string;
  gradient: string;
  badge: string;
}

export interface Feature {
  img: string;
  title: string;
  desc: string;
}

export interface Faq {
  q: string;
  a: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Semua Event', icon: Flame },
  { id: 'pop', label: 'Pop & Indie', icon: Mic },
  { id: 'rock', label: 'Rock & Metal', icon: Disc },
  { id: 'edm', label: 'EDM & DJ', icon: Radio },
  { id: 'festival', label: 'Festival Musik', icon: PartyPopper },
  { id: 'vip', label: 'Exclusive VIP', icon: Sparkles },
  { id: 'promo', label: 'Special Promo', icon: Tag },
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 1,
    title: 'Diskon Flash Sale 50%',
    subtitle: 'Khusus pembelian tiket konser minggu ini',
    code: 'TIKETIKET50',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    badge: 'Limited Time',
  },
  {
    id: 2,
    title: 'Cashback Hingga Rp 150.000',
    subtitle: 'Bayar pakai QRIS & Bank Transfer pilihan',
    code: 'HEMATKONSER',
    gradient: 'from-[#0064D2] via-blue-600 to-indigo-700',
    badge: 'Bank Promo',
  },
  {
    id: 3,
    title: 'Voucher Presale VIP Festival',
    subtitle: 'Dapatkan akses jalur cepat & merchandise resmi',
    code: 'VIPFESTIVAL',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    badge: 'Exclusive',
  },
];

export const FEATURES: Feature[] = [
  {
    img: drawKit1,
    title: 'Tiket Instant & QR Code Direct',
    desc: 'Beli tiket konser favoritmu dalam hitungan detik. E-ticket langsung aktif tanpa antri fisik.',
  },
  {
    img: drawKit2,
    title: 'Antrean Virtual Transparan',
    desc: 'Sistem antrian virtual cerdas & adil. Semua penggemar mendapat kesempatan tempat duduk yang sama.',
  },
  {
    img: drawKit3,
    title: '100% Guaranteed & Safe',
    desc: 'Transaksi terlindungi enkripsi end-to-end. Tiket resmi terjamin keasliannya dari promotor.',
  },
];

export const FAQS: Faq[] = [
  {
    q: 'Bagaimana cara membeli tiket konser di Tiketin Aja?',
    a: 'Pilih event konser favoritmu, tentukan kategori tiket, masuk ke antrian virtual aman, lalu selesaikan pembayaran via Transfer Bank, QRIS, atau E-wallet.',
  },
  {
    q: 'Apakah tiket yang dibeli di sini terjamin asli?',
    a: '100% Terjamin! Kami bekerja sama secara resmi langsung dengan promotor dan penyelenggara event terpercaya di Indonesia.',
  },
  {
    q: 'Bagaimana sistem antrian virtual (Queueing System) bekerja?',
    a: 'Saat kamu menekan "Beli Tiket", sistem secara otomatis mendaftarkan giliranmu di server. Kamu dapat melihat nomor antrean secara realtime tanpa perlu refresh layar.',
  },
  {
    q: 'Berapa lama batas waktu hold tiket saat checkout?',
    a: 'Setelah mendapat giliran antrean, kamu memiliki waktu 5 menit untuk menyelesaikan pembayaran reservasi tiketmu.',
  },
];
