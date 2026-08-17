import { useCallback, useRef } from 'react';

type ImportFn = () => Promise<any>;

// Map routes to their lazy import functions
const ROUTE_IMPORTS: Record<string, ImportFn> = {
  '/events': () => import('../../modules/events/presentation/pages/EventsPage'),
  '/events/:id': () => import('../../modules/events/presentation/pages/EventDetailPage'),
  '/checkout': () => import('../../modules/inventory/presentation/pages/CheckoutPage'),
  '/my-tickets': () => import('../../modules/buyer/presentation/pages/MyTicketsPage'),
  '/organizer/my-events': () => import('../../modules/organizer/presentation/pages/MyOrganizerEventsPage'),
  '/organizer/refunds': () => import('../../modules/organizer/presentation/pages/OrganizerRefundsPage'),
  '/organizer/events/create': () => import('../../modules/organizer/presentation/pages/CreateEventPage'),
  '/organizer/events/edit': () => import('../../modules/organizer/presentation/pages/EditEventPage'),
  '/organizer/events/ticket-types': () => import('../../modules/organizer/presentation/pages/TicketTypesPage'),
  '/organizer/events/gate-operators': () => import('../../modules/organizer/presentation/pages/GateOperatorPage'),
  '/admin/dashboard': () => import('../../modules/admin/presentation/pages/AdminDashboardPage'),
  '/gate/scan': () => import('../../modules/gate-operator/presentation/pages/ScanQRPage'),
  '/payment': () => import('../../modules/orders/presentation/pages/PaymentCallbackPage'),
};

export function usePrefetch() {
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  const prefetchRoute = useCallback((path: string) => {
    // Only prefetch once per session
    if (prefetchedRoutes.current.has(path)) return;

    const importFn = ROUTE_IMPORTS[path];
    if (importFn) {
      importFn().catch((err) => {
        console.warn(`Failed to prefetch route ${path}`, err);
      });
      prefetchedRoutes.current.add(path);
    }
  }, []);

  return { prefetchRoute };
}
