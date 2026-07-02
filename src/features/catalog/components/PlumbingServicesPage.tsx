import { Droplets } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface PlumbingServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function PlumbingServicesPage({ onBack, onBookNow }: PlumbingServicesPageProps) {
  const services = getServicesBySlug('plumbing-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Plumbing Contractors"
      categorySlug="plumbing-services"
      categoryIcon={Droplets}
      themeColor="from-blue-600 to-indigo-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
