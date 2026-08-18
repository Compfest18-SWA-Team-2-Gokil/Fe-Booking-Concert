import { ShieldCheck, Layers, Tag, AlertOctagon, FileText } from 'lucide-react';

export type AdminTab = 'metrics' | 'disputes' | 'promos' | 'audit_logs';

interface AdminHeaderProps {
  activeTab: AdminTab;
}

const TAB_INFO: Record<AdminTab, { title: string; subtitle: string; icon: React.ElementType; badge: string }> = {
  metrics: {
    title: 'Metrik Penjualan & Event',
    subtitle: 'Monitoring performa kuota, jumlah tiket terjual, dan status transaksi platform secara real-time.',
    icon: Layers,
    badge: 'Real-Time Metrics',
  },
  promos: {
    title: 'Voucher & Promo Event',
    subtitle: 'Kelola kode diskon belanja dan voucher promo khusus konser untuk meningkatkan penjualan.',
    icon: Tag,
    badge: 'Discounts & Offers',
  },
  disputes: {
    title: 'Resolusi Sengketa & Refund',
    subtitle: 'Pusat penanganan status transaksi anomali (Payment Discrepancy) dan persetujuan payout refund.',
    icon: AlertOctagon,
    badge: 'Dispute Resolution',
  },
  audit_logs: {
    title: 'Audit Trail & Log Intervensi',
    subtitle: 'Catatan log append-only & immutable untuk setiap tindakan administratif dan override status transaksi.',
    icon: FileText,
    badge: 'Immutable Security Logs',
  },
};

export function AdminHeader({ activeTab }: AdminHeaderProps) {
  const current = TAB_INFO[activeTab] || TAB_INFO.metrics;
  const Icon = current.icon;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0064D2]">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Hub
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            <Icon className="w-3 h-3 text-[#0064D2]" /> {current.badge}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {current.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          {current.subtitle}
        </p>
      </div>
    </div>
  );
}
