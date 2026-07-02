import { Building2 } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface MasonryServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function MasonryServicesPage({ onBack, onBookNow }: MasonryServicesPageProps) {
  const services = getServicesBySlug('masonry-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Masonry Contractors"
      categorySlug="masonry-services"
      categoryIcon={Building2}
      themeColor="from-stone-600 to-gray-700"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
