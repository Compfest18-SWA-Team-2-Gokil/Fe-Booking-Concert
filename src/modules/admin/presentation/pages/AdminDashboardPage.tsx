import { Shield, Users, AlertTriangle, FileText, BarChart3, Activity, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../auth/application/useAuth';

const ADMIN_MENU = [
  {
    icon: Users,
    title: 'Manajemen User',
    desc: 'Lihat, suspend, dan kelola semua akun pengguna platform.',
    color: 'bg-blue-50 text-[#0064D2]',
    border: 'border-blue-100',
  },
  {
    icon: AlertTriangle,
    title: 'Dispute Dashboard',
    desc: 'Panel pelacakan otomatis pesanan Payment Discrepancy & sengketa aktif.',
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
  },
  {
    icon: FileText,
    title: 'Audit Log',
    desc: 'Riwayat immutable setiap transisi status tiket (Append-only, PRD-11).',
    color: 'bg-slate-50 text-slate-600',
    border: 'border-slate-100',
  },
  {
    icon: BarChart3,
    title: 'Override & Reassignment',
    desc: 'Hak prerogatif Admin untuk membatalkan tiket atau memindah kepemilikan kursi.',
    color: 'bg-red-50 text-red-600',
    border: 'border-red-100',
  },
];

export function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Platform Admin · {user?.name} ·{' '}
              <span className="text-red-600 font-semibold">Full Access</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            <Activity className="w-3.5 h-3.5" />
            System Online
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADMIN_MENU.map((m) => (
            <button
              key={m.title}
              className={`bg-white rounded-2xl p-5 border ${m.border} shadow-sm hover:shadow-md transition-all text-left group flex items-start gap-4 opacity-60 cursor-not-allowed`}
              disabled
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">{m.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{m.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Fitur-fitur admin akan terhubung ke API saat backend PRD-10 &amp; PRD-11 siap.
        </p>
      </div>
    </div>
  );
}
