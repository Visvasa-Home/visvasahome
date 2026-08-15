import { Paintbrush } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface PaintingServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function PaintingServicesPage({ onBack, onBookNow }: PaintingServicesPageProps) {
  const services = getServicesBySlug('painting-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Painting Contractors"
      categorySlug="painting-services"
      categoryIcon={Paintbrush}
      themeColor="from-blue-500 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
