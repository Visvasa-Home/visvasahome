import { Layers } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface FlooringServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function FlooringServicesPage({ onBack, onBookNow }: FlooringServicesPageProps) {
  const services = getServicesBySlug('flooring-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Flooring Contractors"
      categorySlug="flooring-services"
      categoryIcon={Layers}
      themeColor="from-blue-700 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
