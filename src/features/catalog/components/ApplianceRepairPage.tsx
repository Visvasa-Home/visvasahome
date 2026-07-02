import { Settings } from 'lucide-react';
import { ServiceCategoryPageTemplate } from '@catalog/components/ServiceCategoryPageTemplate';
import { getServicesBySlug } from '@catalog/data/servicesData';

interface ApplianceRepairPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function ApplianceRepairPage({ onBack, onBookNow }: ApplianceRepairPageProps) {
  const services = getServicesBySlug('appliance-repair');
  const subcategories = Array.from(new Set(services.map(s => s.subcategory)));

  return (
    <ServiceCategoryPageTemplate
      categoryName="Appliance Repair Specialists"
      categorySlug="appliance-repair"
      categoryIcon={Settings}
      themeColor="from-blue-700 to-indigo-700"
      services={services}
      subcategories={subcategories}
      onBack={onBack}
      onBookNow={onBookNow}
    />
  );
}
