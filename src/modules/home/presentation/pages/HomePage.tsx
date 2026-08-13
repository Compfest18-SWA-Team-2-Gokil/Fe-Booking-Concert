import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../../events/application/useEvents';
import { useHomeFilter } from '../../application/useHomeFilter';
import { HeroSection } from '../components/HeroSection';
import { CategoryPills } from '../components/CategoryPills';
import { PromoBanners } from '../components/PromoBanners';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { FaqAccordion } from '../components/FaqAccordion';
import { EventGallery } from '../components/EventGallery';

export function HomePage() {
  const navigate = useNavigate();
  const { data: events, isLoading } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, filteredEvents } =
    useHomeFilter(events);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim() || selectedCity) {
      navigate(`/events?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`);
    } else {
      navigate('/events');
    }
  }

  return (
    <div className="w-full bg-white">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onSearch={handleSearch}
      />
      <CategoryPills selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <PromoBanners onNavigate={() => navigate('/events')} />
      <UpcomingEvents
        events={filteredEvents?.slice(0, 6)}
        isLoading={isLoading}
        onResetFilter={() => { setSearchQuery(''); setSelectedCity(''); }}
        onNavigateToEvents={() => navigate('/events')}
      />
      <WhyChooseUs />
      <FaqAccordion />
      <EventGallery />
    </div>
  );
}
