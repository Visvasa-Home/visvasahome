import { Home } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface RoofingServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function RoofingServicesPage({ onBack, onBookNow }: RoofingServicesPageProps) {
  const services = getServicesBySlug('roofing-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Roofing Contractors"
      categorySlug="roofing-services"
      categoryIcon={Home}
      themeColor="from-slate-600 to-gray-800"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
