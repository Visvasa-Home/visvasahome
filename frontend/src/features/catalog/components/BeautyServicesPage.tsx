import { Scissors } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface BeautyServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function BeautyServicesPage({ onBack, onBookNow }: BeautyServicesPageProps) {
  const services = getServicesBySlug('beauty-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Beauty & Personal Care Professionals"
      categorySlug="beauty-services"
      categoryIcon={Scissors}
      themeColor="from-blue-500 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
