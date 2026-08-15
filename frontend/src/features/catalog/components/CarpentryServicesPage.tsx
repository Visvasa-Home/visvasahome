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
      themeColor="from-blue-600 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
