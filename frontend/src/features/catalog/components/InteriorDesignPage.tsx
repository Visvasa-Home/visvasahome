import { Sofa } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface InteriorDesignPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function InteriorDesignPage({ onBack, onBookNow }: InteriorDesignPageProps) {
  const services = getServicesBySlug('interior-design');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Interior Design Contractors"
      categorySlug="interior-design"
      categoryIcon={Sofa}
      themeColor="from-blue-600 to-blue-700"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
