import { PartyPopper } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface EventServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function EventServicesPage({ onBack, onBookNow }: EventServicesPageProps) {
  const services = getServicesBySlug('event-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Event Service Professionals"
      categorySlug="event-services"
      categoryIcon={PartyPopper}
      themeColor="from-blue-600 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
