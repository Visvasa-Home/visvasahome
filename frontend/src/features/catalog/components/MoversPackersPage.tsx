import { Package } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface MoversPackersPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function MoversPackersPage({ onBack, onBookNow }: MoversPackersPageProps) {
  const services = getServicesBySlug('movers-packers');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Movers & Packers"
      categorySlug="movers-packers"
      categoryIcon={Package}
      themeColor="from-blue-600 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
