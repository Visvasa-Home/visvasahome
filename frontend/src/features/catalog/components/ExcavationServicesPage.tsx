import { Shovel } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface ExcavationServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function ExcavationServicesPage({ onBack, onBookNow }: ExcavationServicesPageProps) {
  const services = getServicesBySlug('excavation-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Excavation Contractors"
      categorySlug="excavation-services"
      categoryIcon={Shovel}
      themeColor="from-blue-700 to-blue-700"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
