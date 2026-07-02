import { Bug } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface PestControlPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function PestControlPage({ onBack, onBookNow }: PestControlPageProps) {
  const services = getServicesBySlug('pest-control');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Pest Control Contractors"
      categorySlug="pest-control"
      categoryIcon={Bug}
      themeColor="from-green-600 to-emerald-700"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
