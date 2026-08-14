import type { Event } from '../../domain/models/Event';
import { EventCard } from './EventCard';
import { useTicketTypes } from '../../application/useTicketTypes';

function EventCardWithTypes({ eventId, ...rest }: { eventId: string } & Parameters<typeof EventCard>[0]) {
  const { data: ticketTypes } = useTicketTypes(eventId);
  return <EventCard {...rest} ticketTypes={ticketTypes} />;
}

interface EventGridProps {
  events: Event[];
}

export function EventGrid({ events }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCardWithTypes key={event.id} event={event} eventId={event.id} />
      ))}
    </div>
  );
}
