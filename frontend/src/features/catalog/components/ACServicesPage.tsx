import { Wind } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface ACServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function ACServicesPage({ onBack, onBookNow }: ACServicesPageProps) {
  const services = getServicesBySlug('ac-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="HVAC Contractors"
      categorySlug="ac-services"
      categoryIcon={Wind}
      themeColor="from-blue-500 to-blue-500"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
