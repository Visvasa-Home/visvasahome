import { Trees } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface LandscapingServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function LandscapingServicesPage({ onBack, onBookNow }: LandscapingServicesPageProps) {
  const services = getServicesBySlug('landscaping-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Landscaping Contractors"
      categorySlug="landscaping-services"
      categoryIcon={Trees}
      themeColor="from-blue-600 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
