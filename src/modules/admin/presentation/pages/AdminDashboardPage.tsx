import { Users, Banknote, Calendar, Activity, Shield, Key } from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';

export function AdminDashboardPage() {
  // Use the events API to get total events
  const { data: events, isPending } = useEvents();
  const totalEvents = events?.length ?? 'error';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Ringkasan Sistem BE</h1>
            <p className="text-sm text-gray-500">
              Pantau performa platform dan kelola akses pengguna Anda.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Pengguna */}
          {/* TODO: Butuh API untuk get total pengguna platform */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-sm">Total Pengguna</span>
            </div>
            <div className="text-3xl font-bold text-red-500 mt-auto">error</div>
          </div>

          {/* Volume Transaksi */}
          {/* TODO: Butuh API untuk get total volume transaksi secara global */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Banknote className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-sm">Volume Transaksi</span>
            </div>
            <div className="text-3xl font-bold text-red-500 mt-auto">error</div>
          </div>

          {/* Total Event */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-sm">Total Event</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-auto">
              {isPending ? '...' : totalEvents}
            </div>
          </div>

          {/* Server Uptime */}
          {/* TODO: Butuh API untuk get status server uptime */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Activity className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-sm">Server Uptime</span>
            </div>
            <div className="text-3xl font-bold text-red-500 mt-auto">error</div>
          </div>
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Aktivitas Platform */}
            {/* TODO: Butuh API untuk data grafik aktivitas platform */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Platform</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <span className="text-gray-400 font-medium">No Chart Data (error)</span>
              </div>
            </div>

            {/* Manajemen Pengguna */}
            {/* TODO: Butuh API untuk list semua pengguna platform beserta rolenya */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Manajemen Pengguna</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600">
                    <tr>
                      <th className="px-6 py-4">Pengguna</th>
                      <th className="px-6 py-4">Peran</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Terdaftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900" colSpan={4} align="center">
                        <span className="text-red-500 font-bold">error</span> - API not available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Keamanan & Log */}
            {/* TODO: Butuh API untuk riwayat system logs keamanan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">Keamanan & Log</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">System Logs</h4>
                    <p className="text-xs text-gray-500 mt-1">No API available</p>
                    <div className="mt-2 text-red-500 font-bold text-sm">error</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
