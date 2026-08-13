import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/application/useAuth';
import { Header } from '../../shared/components/Header';
import { Footer } from '../../shared/components/Footer';
import { LoginPage } from '../../modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/presentation/pages/RegisterPage';
import { HomePage } from '../../modules/home/presentation/pages/HomePage';
import { EventsPage } from '../../modules/events/presentation/pages/EventsPage';
import { EventDetailPage } from '../../modules/events/presentation/pages/EventDetailPage';
import { CheckoutPage } from '../../modules/inventory/presentation/pages/CheckoutPage';

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

function PublicHomeRoute() {
  const { token } = useAuth();
  return token ? <Navigate to="/events" replace /> : <HomePage />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <PublicHomeRoute /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/events', element: <EventsPage /> },
          { path: '/events/:id', element: <EventDetailPage /> },
          { path: '/checkout/:id', element: <CheckoutPage /> },
        ],
      },
    ],
  },
]);
