/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/application/useAuth';
import { Header } from '../../shared/components/layout/Header';
import { Footer } from '../../shared/components/layout/Footer';
import { SidebarLayout } from '../../shared/components/layout/SidebarLayout';
import { Spinner } from '../../shared/components/ui/Spinner';
// Eager: entry-point pages (landing, auth)
import { LoginPage } from '../../modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/presentation/pages/RegisterPage';
import { HomePage } from '../../modules/home/presentation/pages/HomePage';
// Lazy: role-specific & secondary pages
const EventsPage = lazy(() => import('../../modules/events/presentation/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('../../modules/events/presentation/pages/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const CheckoutPage = lazy(() => import('../../modules/inventory/presentation/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
// Organizer
const OrganizerDashboardPage = lazy(() => import('../../modules/organizer/presentation/pages/OrganizerDashboardPage').then(m => ({ default: m.OrganizerDashboardPage })));
const CreateEventPage = lazy(() => import('../../modules/organizer/presentation/pages/CreateEventPage').then(m => ({ default: m.CreateEventPage })));
const TicketTypesPage = lazy(() => import('../../modules/organizer/presentation/pages/TicketTypesPage').then(m => ({ default: m.TicketTypesPage })));
const GateOperatorPage = lazy(() => import('../../modules/organizer/presentation/pages/GateOperatorPage').then(m => ({ default: m.GateOperatorPage })));
const MyOrganizerEventsPage = lazy(() => import('../../modules/organizer/presentation/pages/MyOrganizerEventsPage').then(m => ({ default: m.MyOrganizerEventsPage })));
const EditEventPage = lazy(() => import('../../modules/organizer/presentation/pages/EditEventPage').then(m => ({ default: m.EditEventPage })));
// Buyer
const MyTicketsPage = lazy(() => import('../../modules/buyer/presentation/pages/MyTicketsPage').then(m => ({ default: m.MyTicketsPage })));
// Admin
const AdminDashboardPage = lazy(() => import('../../modules/admin/presentation/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
// Gate Operator
const ScanQRPage = lazy(() => import('../../modules/gate-operator/presentation/pages/ScanQRPage').then(m => ({ default: m.ScanQRPage })));

/** Redirect ke halaman utama sesuai role setelah login */
function roleHome(role?: string): string {
  switch (role) {
    case 'ORGANIZER':
      return '/organizer/my-events';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'GATE_OPERATOR':
      return '/gate/scan';
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<SuspenseFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
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

const PaymentCallbackPage = lazy(() => import('../../modules/orders/presentation/pages/PaymentCallbackPage').then(m => ({ default: m.PaymentCallbackPage })));

/** Adaptive layout for events: SidebarLayout when logged in, Header/Footer Layout when guest */
function EventsLayoutWrapper() {
  const { user } = useAuth();
  return user ? <SidebarLayout /> : <Layout />;
}

export const router = createBrowserRouter([
  // Public layout (Header + Footer, no sidebar)
  {
    element: <Layout />,
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
    children: [
      {
        element: <SidebarLayout />,
        children: [
          // BUYER only
          {
            element: <RequireRole roles={['BUYER']} />,
            children: [
              { path: '/checkout/:id', element: <CheckoutPage /> },
              { path: '/my-tickets', element: <MyTicketsPage /> },
            ],
          },

          // ORGANIZER
          {
            element: <RequireRole roles={['ORGANIZER']} />,
            children: [
              { path: '/organizer/dashboard', element: <OrganizerDashboardPage /> },
              { path: '/organizer/my-events', element: <MyOrganizerEventsPage /> },
              { path: '/organizer/events', element: <MyOrganizerEventsPage /> },
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
              { path: '/gate/scan', element: <ScanQRPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

