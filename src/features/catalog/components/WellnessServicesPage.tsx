import { Heart } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface WellnessServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function WellnessServicesPage({ onBack, onBookNow }: WellnessServicesPageProps) {
  const services = getServicesBySlug('wellness-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Wellness & Fitness Professionals"
      categorySlug="wellness-services"
      categoryIcon={Heart}
      themeColor="from-purple-500 to-violet-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
