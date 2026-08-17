import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '../../../modules/auth/application/useAuth';
import { Footer } from './Footer';
import { SidebarContent } from './SidebarContent';

const PAGE_TITLES: Record<string, string> = {
  '/my-tickets': 'Tiket Saya',
  '/organizer/my-events': 'Event Saya',
  '/organizer/refunds': 'Persetujuan Refund',
  '/organizer/events/create': 'Buat Event Baru',
  '/gate/scan': 'Scan QR Tiket',
  '/admin/dashboard': 'Admin Panel',
  '/events': 'Semua Events',
};

export function SidebarLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing drawer state with route changes
    setMobileOpen(false);
  }, [location.pathname]);

  const pageTitle = PAGE_TITLES[location.pathname] ?? '';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-gray-100 bg-white sticky top-0 h-screen transition-all duration-300 ${
          collapsed ? 'w-0 overflow-hidden border-r-0' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title={collapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
            >
              {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {pageTitle && (
              <span className="font-bold text-gray-800 text-sm">{pageTitle}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0064D2] text-white flex items-center justify-center text-xs font-black shadow-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-gray-700 hidden sm:inline">{user?.name}</span>
          </div>
        </header>

        {/* Page View */}
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full border-4 border-[#0064D2] border-t-transparent w-10 h-10" />
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
}
