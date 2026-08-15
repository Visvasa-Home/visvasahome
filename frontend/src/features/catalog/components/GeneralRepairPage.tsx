import { Wrench } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface GeneralRepairPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function GeneralRepairPage({ onBack, onBookNow }: GeneralRepairPageProps) {
  const services = getServicesBySlug('general-repair');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="General Repair & Maintenance"
      categorySlug="general-repair"
      categoryIcon={Wrench}
      themeColor="from-gray-600 to-gray-800"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
