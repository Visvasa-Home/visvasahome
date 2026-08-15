import { Users } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface CareServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function CareServicesPage({ onBack, onBookNow }: CareServicesPageProps) {
  const services = getServicesBySlug('care-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Care & Support Professionals"
      categorySlug="care-services"
      categoryIcon={Users}
      themeColor="from-blue-500 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
