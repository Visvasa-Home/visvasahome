import { Zap } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface ElectricalServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function ElectricalServicesPage({ onBack, onBookNow }: ElectricalServicesPageProps) {
  const services = getServicesBySlug('electrical-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Electrical Contractors"
      categorySlug="electrical-services"
      categoryIcon={Zap}
      themeColor="from-blue-500 to-blue-500"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
