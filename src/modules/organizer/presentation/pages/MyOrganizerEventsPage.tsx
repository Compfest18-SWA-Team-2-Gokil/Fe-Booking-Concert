import { useNavigate } from 'react-router-dom';
import { useOrganizerEvents } from '../../application/useOrganizerEvents';
import { OrganizerEventMetricsModal } from '../components/OrganizerEventMetricsModal';
import { OrganizerWorkspaceHeader } from '../components/events/OrganizerWorkspaceHeader';
import { OrganizerKpiCards } from '../components/events/OrganizerKpiCards';
import { OrganizerEventsTable } from '../components/events/OrganizerEventsTable';
import { OrganizerAnalyticsOverview } from '../components/events/OrganizerAnalyticsOverview';

export function MyOrganizerEventsPage() {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    metricEventId,
    setMetricEventId,
    myEvents,
    filteredEvents,
    metricQueries,
    organizerStats,
    isLoading,
    handleDelete,
    isDeleting,
  } = useOrganizerEvents();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <OrganizerWorkspaceHeader
          onCreateEvent={() => navigate('/organizer/events/create')}
        />

        <OrganizerKpiCards
          totalEvents={myEvents.length}
          stats={organizerStats}
        />

        <OrganizerAnalyticsOverview
          events={myEvents}
          eventsLoading={isLoading}
          stats={organizerStats}
          metricQueries={metricQueries}
        />

        <OrganizerEventsTable
          events={filteredEvents}
          metricQueries={metricQueries}
          search={search}
          isLoading={isLoading}
          isDeleting={isDeleting}
          onSearchChange={setSearch}
          onOpenMetrics={setMetricEventId}
          onManageTickets={(id) => navigate(`/organizer/events/${id}/ticket-types`)}
          onManageOperators={(id) => navigate(`/organizer/events/${id}/gate-operators`)}
          onEditEvent={(id) => navigate(`/organizer/events/${id}/edit`)}
          onDeleteEvent={handleDelete}
        />
      </div>

      {metricEventId && (
        <OrganizerEventMetricsModal
          eventId={metricEventId}
          onClose={() => setMetricEventId(null)}
        />
      )}
    </div>
  );
}

