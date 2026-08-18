import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../../events/application/useEvents';
import { useHomeFilter } from '../../application/useHomeFilter';
import { HeroSection } from '../components/HeroSection';
import { PromoBanners } from '../components/PromoBanners';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { FaqAccordion } from '../components/FaqAccordion';
import { EventGallery } from '../components/EventGallery';

export function HomePage() {
  const navigate = useNavigate();
  const { data: events, isLoading } = useEvents();
  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory,
    filteredEvents,
    applyFilters,
    resetFilters,
  } =
    useHomeFilter(events);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters();
    document.getElementById('upcoming-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="w-full bg-white">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={handleSearch}
      />
      <div className="pt-10">
        <PromoBanners onNavigate={() => navigate('/events')} />
      </div>
      <UpcomingEvents
        events={filteredEvents?.slice(0, 6)}
        isLoading={isLoading}
        onResetFilter={resetFilters}
        onNavigateToEvents={() => navigate('/events')}
      />
      <WhyChooseUs />
      <FaqAccordion />
      <EventGallery />
    </div>
  );
}
