import { useState, useMemo } from 'react';
import type { Event, EventCategory } from '../../events/domain/models/Event';

export function useHomeFilter(events: Event[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | ''>('');

  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedCity, setAppliedCity] = useState('');
  const [appliedCategory, setAppliedCategory] = useState<EventCategory | ''>('');

  const filteredEvents = useMemo(() => {
    return events?.filter((event) => {
      const matchesSearch =
        !appliedSearchQuery ||
        event.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(appliedSearchQuery.toLowerCase()));

      const matchesCity =
        !appliedCity || event.location.toLowerCase().includes(appliedCity.toLowerCase());

      const matchesCategory =
        !appliedCategory || event.category === appliedCategory;

      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [events, appliedSearchQuery, appliedCity, appliedCategory]);

  function applyFilters() {
    setAppliedSearchQuery(searchQuery);
    setAppliedCity(selectedCity);
    setAppliedCategory(selectedCategory);
  }

  function resetFilters() {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCategory('');
    setAppliedSearchQuery('');
    setAppliedCity('');
    setAppliedCategory('');
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory,
    filteredEvents,
    applyFilters,
    resetFilters,
  };
}

