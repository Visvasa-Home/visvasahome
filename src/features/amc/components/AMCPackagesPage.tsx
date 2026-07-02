import { useState, useEffect } from 'react';
import { Check, X, Shield, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { getAMCPackages, type AMCPackage } from '@amc/services/amcService';


interface AMCPackagesPageProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

export const AMCPackagesPage = ({ onBack, onNavigate }: AMCPackagesPageProps) => {
  const [packages, setPackages] = useState<AMCPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');


  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const allPackages = await getAMCPackages();
      setPackages(allPackages);
    } catch (error) {
      console.error('Failed to load AMC packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Plans' },
    { id: 'home', label: 'Home AMC' },
    { id: 'office', label: 'Office AMC' },
    { id: 'commercial', label: 'Commercial AMC' },
    { id: 'industrial', label: 'Industrial AMC' },
    { id: 'healthcare', label: 'Healthcare AMC' },
    { id: 'educational', label: 'Educational AMC' },
    { id: 'hospitality', label: 'Hospitality AMC' },
    { id: 'society', label: 'Society AMC' },
    { id: 'ac', label: 'AC AMC' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'appliance', label: 'Appliances' },
  ];

  const filteredPackages = selectedCategory === 'all'
    ? packages
    : packages.filter(pkg => pkg.category === selectedCategory);

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'gold': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-900 border-gray-300';
      case 'premium': return 'bg-blue-100 text-gray-900 border-blue-200';
      default: return 'bg-green-100 text-green-900 border-green-300';
    }
  };

  const PackageCard = ({ pkg }: { pkg: AMCPackage }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {pkg.tier === 'platinum' && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-400 text-white text-xs px-3 py-1 rounded-bl-lg">
          POPULAR
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{pkg.name}</CardTitle>
            <CardDescription className="mt-2">{pkg.description}</CardDescription>
          </div>
          <Badge className={getTierColor(pkg.tier)}>
            {pkg.tier.toUpperCase()}
          </Badge>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {pkg.price > 0 ? `₹${pkg.price.toLocaleString('en-IN')}` : 'Custom'}
            </span>
            {pkg.price > 0 && (
              <span className="text-sm text-[color:var(--color-text-secondary)]">
                / year
              </span>
            )}
          </div>
          {pkg.price > 0 && (
            <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
              ₹{Math.floor(pkg.price / 12).toLocaleString('en-IN')} per month
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Coverage */}
        <div>
          <p className="text-sm font-semibold mb-2">Coverage</p>
          <div className="flex flex-wrap gap-2">
            {pkg.coverage.map((item, idx) => (
              <Badge key={idx} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Visits */}
        <div className="flex items-center gap-2 py-3 border-y border-[color:var(--color-border)]">
          <Calendar className="w-5 h-5 text-[color:var(--color-text-secondary)]" />
          <span className="font-semibold">{pkg.visitsPerYear} visits per year</span>
        </div>

        {/* Features */}
        <div>
          <p className="text-sm font-semibold mb-3">Key Features</p>
          <ul className="space-y-2">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        {pkg.exclusions.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2 text-[color:var(--color-text-secondary)]">
              Not Included
            </p>
            <ul className="space-y-1">
              {pkg.exclusions.slice(0, 2).map((exclusion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[color:var(--color-text-secondary)]">
                  <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{exclusion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Terms */}
        <div className="bg-[color:var(--color-background)] rounded-lg p-3">
          <p className="text-xs text-[color:var(--color-text-secondary)]">
            <Shield className="w-3 h-3 inline mr-1" />
            {pkg.terms}
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => onNavigate('amc-booking', { packageId: pkg.id, category: pkg.category })}
          className="w-full"
          size="lg"
        >
          {pkg.price > 0 ? 'Subscribe Now' : 'Get Custom Quote'}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-4">
        <div className="max-w-6xl mx-auto">
          <Button onClick={onBack} variant="ghost">← Back</Button>
          <div className="text-center py-12">
            <p className="text-[color:var(--color-text-secondary)]">Loading AMC packages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] pb-20">
      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold">Annual Maintenance Contracts (AMC)</h1>
          <p className="text-[color:var(--color-text-secondary)] mt-2">
            Choose the perfect maintenance plan for your home or office. Save money with preventive care and priority support.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Benefits Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose AMC?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Save Up to 30%</p>
              <p className="text-sm text-blue-800">
                Preventive maintenance costs less than emergency repairs
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Priority Support</p>
              <p className="text-sm text-blue-800">
                Skip the queue with dedicated support and faster response times
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Peace of Mind</p>
              <p className="text-sm text-blue-800">
                Regular check-ups ensure everything works perfectly year-round
              </p>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[color:var(--color-text-secondary)]">
              No packages found in this category
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] p-6">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-1">What is included in AMC visits?</p>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                Each visit includes thorough inspection, cleaning, minor repairs, and a detailed service report.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Can I upgrade my plan mid-contract?</p>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                Yes! You can upgrade anytime. We'll pro-rate the difference and extend your contract benefits.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">What happens if I need service outside scheduled visits?</p>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                AMC members get priority booking and 15% discount on all add-on services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
