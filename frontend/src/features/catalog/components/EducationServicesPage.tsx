import { BookOpen } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface EducationServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function EducationServicesPage({ onBack, onBookNow }: EducationServicesPageProps) {
  const services = getServicesBySlug('education-services');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Education & Tutors"
      categorySlug="education-services"
      categoryIcon={BookOpen}
      themeColor="from-blue-600 to-blue-600"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
