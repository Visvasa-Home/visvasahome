import { Dog } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface PetCarePageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function PetCarePage({ onBack, onBookNow }: PetCarePageProps) {
  const services = getServicesBySlug('pet-care');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Pet Care & Boarding"
      categorySlug="pet-care"
      categoryIcon={Dog}
      themeColor="from-blue-500 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
