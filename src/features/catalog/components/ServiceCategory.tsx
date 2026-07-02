import { LucideIcon } from 'lucide-react';

interface ServiceCategoryProps {
  icon: LucideIcon;
  title: string;
  services: string[];
  badge: string | null;
  onClick?: () => void;
}

export function ServiceCategory({ icon: Icon, title, services, badge, onClick }: ServiceCategoryProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all border border-gray-200 hover:border-blue-200 cursor-pointer hover:-translate-y-1 group"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-all">
          <Icon className="w-7 h-7 text-[#2563EB]" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
          {badge && (
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
              {badge}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2.5">
        {services.map((service, index) => (
          <li key={index} className="flex items-start gap-2.5 text-gray-700 text-sm">
            <span className="text-[#2563EB] mt-1 font-bold">•</span>
            <span className="leading-relaxed">{service}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
