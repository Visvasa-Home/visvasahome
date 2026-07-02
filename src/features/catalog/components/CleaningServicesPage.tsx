import { Sparkles } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface CleaningServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function CleaningServicesPage({ onBack, onBookNow }: CleaningServicesPageProps) {
  const services = getServicesBySlug('cleaning-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Cleaning Service Contractors"
      categorySlug="cleaning-services"
      categoryIcon={Sparkles}
      themeColor="from-teal-500 to-cyan-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
