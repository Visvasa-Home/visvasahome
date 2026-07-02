import { Hammer } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface CarpentryServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function CarpentryServicesPage({ onBack, onBookNow }: CarpentryServicesPageProps) {
  const services = getServicesBySlug('carpentry-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Framing & Carpentry Contractors"
      categorySlug="carpentry-services"
      categoryIcon={Hammer}
      themeColor="from-amber-600 to-yellow-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
