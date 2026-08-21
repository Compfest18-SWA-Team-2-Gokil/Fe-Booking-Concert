/* eslint-disable react-refresh/only-export-components */
import { Suspense, Component, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/application/useAuth';
import { Header } from '../../shared/components/layout/Header';
import { Footer } from '../../shared/components/layout/Footer';
import { SidebarLayout } from '../../shared/components/layout/SidebarLayout';
import { Spinner } from '../../shared/components/ui/Spinner';

// Direct Eager imports untuk kestabilan deployment di Production (mencegah error dynamic import chunk stale)
import { LoginPage } from '../../modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/presentation/pages/RegisterPage';
import { HomePage } from '../../modules/home/presentation/pages/HomePage';
import { EventsPage } from '../../modules/events/presentation/pages/EventsPage';
import { EventDetailPage } from '../../modules/events/presentation/pages/EventDetailPage';
import { CheckoutPage } from '../../modules/inventory/presentation/pages/CheckoutPage';
import { MyTicketsPage } from '../../modules/buyer/presentation/pages/MyTicketsPage';
import { MyPromosPage } from '../../modules/buyer/presentation/pages/MyPromosPage';
import { PaymentCallbackPage } from '../../modules/orders/presentation/pages/PaymentCallbackPage';
// Organizer
import { CreateEventPage } from '../../modules/organizer/presentation/pages/CreateEventPage';
import { TicketTypesPage } from '../../modules/organizer/presentation/pages/TicketTypesPage';
import { GateOperatorPage } from '../../modules/organizer/presentation/pages/GateOperatorPage';
import { MyOrganizerEventsPage } from '../../modules/organizer/presentation/pages/MyOrganizerEventsPage';
import { EditEventPage } from '../../modules/organizer/presentation/pages/EditEventPage';
import { OrganizerRefundsPage } from '../../modules/organizer/presentation/pages/OrganizerRefundsPage';
// Admin
import { AdminDashboardPage } from '../../modules/admin/presentation/pages/AdminDashboardPage';
// Gate Operator
import { ScanQRPage } from '../../modules/gate-operator/presentation/pages/ScanQRPage';
import { GateMyEventsPage } from '../../modules/gate-operator/presentation/pages/GateMyEventsPage';
import { ProfilePage } from '../../modules/profile/presentation/pages/ProfilePage';

/** Global Error Boundary untuk menangani error tak terduga */
class RouteErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean }> {
  constructor(props: { children?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Jika error dynamic module import stale, otomatis reload ke versi terbaru
    if (error instanceof Error && error.message.includes('dynamically imported module')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Pembaruan Aplikasi</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-sm">
            Versi terbaru aplikasi telah dirilis. Silakan muat ulang halaman untuk melanjutkan.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Redirect ke halaman utama sesuai role setelah login */
function roleHome(role?: string): string {
  switch (role) {
    case 'ORGANIZER':
      return '/organizer/my-events';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'GATE_OPERATOR':
      return '/gate/my-events';
    default:
      return '/events';
  }
}

function SuspenseFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <Spinner className="w-10 h-10" />
    </div>
  );
}

function Layout() {
  return (
    <RouteErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<SuspenseFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </RouteErrorBoundary>
  );
}

function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function RequireRole({ roles }: { roles: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />;
  return <Outlet />;
}

/** Landing page: jika sudah login, redirect ke halaman sesuai role */
function PublicHomeRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to={roleHome(user.role)} replace />;
  return <HomePage />;
}

/** Login/Register: jika sudah login, redirect ke halaman sesuai role */
function PublicAuthRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to={roleHome(user.role)} replace />;
  return <Outlet />;
}

/** Adaptive layout for events: SidebarLayout when logged in, Header/Footer Layout when guest */
function EventsLayoutWrapper() {
  const { user } = useAuth();
  return user ? <SidebarLayout /> : <Layout />;
}

export const router = createBrowserRouter([
  // Public layout (Header + Footer, no sidebar)
  {
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <PublicHomeRoute /> },
      {
        element: <PublicAuthRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },

  // Events browsing & Payment Callback (accessible to both guests and authenticated users)
  {
    element: <EventsLayoutWrapper />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/events', element: <EventsPage /> },
      { path: '/events/:id', element: <EventDetailPage /> },
      { path: '/payment/callback', element: <PaymentCallbackPage /> },
      { path: '/payment/success', element: <PaymentCallbackPage /> },
      { path: '/payment/finish', element: <PaymentCallbackPage /> },
      { path: '/payment/result', element: <PaymentCallbackPage /> },
      { path: '/orders/:orderId/status', element: <PaymentCallbackPage /> },
    ],
  },

  // Authenticated layout (sidebar, no header/footer)
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <SidebarLayout />,
        children: [
          // All authenticated roles
          { path: '/me', element: <ProfilePage /> },

          // BUYER only
          {
            element: <RequireRole roles={['BUYER']} />,
            children: [
              { path: '/checkout/:id', element: <CheckoutPage /> },
              { path: '/my-tickets', element: <MyTicketsPage /> },
              { path: '/my-promos', element: <MyPromosPage /> },
            ],
          },

          // ORGANIZER
          {
            element: <RequireRole roles={['ORGANIZER']} />,
            children: [
              { path: '/organizer/my-events', element: <MyOrganizerEventsPage /> },
              { path: '/organizer/events', element: <MyOrganizerEventsPage /> },
              { path: '/organizer/refunds', element: <OrganizerRefundsPage /> },
              { path: '/organizer/dashboard', element: <Navigate to="/organizer/my-events" replace /> },
              { path: '/organizer/events/create', element: <CreateEventPage /> },
              { path: '/organizer/events/:eventId/edit', element: <EditEventPage /> },
              { path: '/organizer/events/:eventId/ticket-types', element: <TicketTypesPage /> },
              { path: '/organizer/events/:eventId/gate-operators', element: <GateOperatorPage /> },
            ],
          },

          // ADMIN
          {
            element: <RequireRole roles={['ADMIN']} />,
            children: [
              { path: '/admin/dashboard', element: <AdminDashboardPage /> },
            ],
          },

          // GATE_OPERATOR
          {
            element: <RequireRole roles={['GATE_OPERATOR']} />,
            children: [
              { path: '/gate/my-events', element: <GateMyEventsPage /> },
              { path: '/gate/scan', element: <ScanQRPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
