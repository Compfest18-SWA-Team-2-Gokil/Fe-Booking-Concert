import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/application/useAuth';
import { Header } from '../../shared/components/layout/Header';
import { Footer } from '../../shared/components/layout/Footer';
import { SidebarLayout } from '../../shared/components/layout/SidebarLayout';
import { LoginPage } from '../../modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/presentation/pages/RegisterPage';
import { HomePage } from '../../modules/home/presentation/pages/HomePage';
import { EventsPage } from '../../modules/events/presentation/pages/EventsPage';
import { EventDetailPage } from '../../modules/events/presentation/pages/EventDetailPage';
import { CheckoutPage } from '../../modules/inventory/presentation/pages/CheckoutPage';
// Organizer
import { OrganizerDashboardPage } from '../../modules/organizer/presentation/pages/OrganizerDashboardPage';
import { CreateEventPage } from '../../modules/organizer/presentation/pages/CreateEventPage';
import { TicketTypesPage } from '../../modules/organizer/presentation/pages/TicketTypesPage';
import { GateOperatorPage } from '../../modules/organizer/presentation/pages/GateOperatorPage';
import { MyOrganizerEventsPage } from '../../modules/organizer/presentation/pages/MyOrganizerEventsPage';
import { EditEventPage } from '../../modules/organizer/presentation/pages/EditEventPage';
// Buyer
import { MyTicketsPage } from '../../modules/buyer/presentation/pages/MyTicketsPage';
// Admin
import { AdminDashboardPage } from '../../modules/admin/presentation/pages/AdminDashboardPage';
// Gate Operator
import { ScanQRPage } from '../../modules/gate-operator/presentation/pages/ScanQRPage';

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

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
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

  // Events browsing (accessible to both guests and authenticated users)
  {
    element: <EventsLayoutWrapper />,
    children: [
      { path: '/events', element: <EventsPage /> },
      { path: '/events/:id', element: <EventDetailPage /> },
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

