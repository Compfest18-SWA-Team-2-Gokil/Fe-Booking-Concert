import { useState, useMemo } from 'react';
import type { Event } from '../../events/domain/models/Event';

export function useHomeFilter(events: Event[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedCity, setAppliedCity] = useState('');

  const filteredEvents = useMemo(() => {
    return events?.filter((event) => {
      const matchesSearch =
        !appliedSearchQuery ||
        event.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(appliedSearchQuery.toLowerCase());
      const matchesCity =
        !appliedCity || event.location.toLowerCase().includes(appliedCity.toLowerCase());
      return matchesSearch && matchesCity;
    });
  }, [events, appliedSearchQuery, appliedCity]);

  function applyFilters() {
    setAppliedSearchQuery(searchQuery);
    setAppliedCity(selectedCity);
  }

  function resetFilters() {
    setSearchQuery('');
    setSelectedCity('');
    setAppliedSearchQuery('');
    setAppliedCity('');
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    filteredEvents,
    applyFilters,
    resetFilters,
  };
}
