import { ArrowLeft, HardHat, CheckCircle2, Shield, Star, Users, Phone, Wrench, Zap, Droplets, PaintBucket, Hammer, BrickWall, Drill } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';

interface ConstructionServicesPageProps {
  onBack: () => void;
  onBookNow: () => void;
  onNavigate: (page: string) => void;
}

const constructionCategories = [
  {
    icon: Droplets,
    title: 'Plumbing Contractors',
    description: 'Complete plumbing solutions for residential and commercial projects',
    services: ['New installations', 'Repairs & maintenance', 'Drainage systems', 'Water supply lines'],
    startingPrice: '₹299',
    slug: 'plumbing-services',
  },
  {
    icon: Zap,
    title: 'Electrical Contractors',
    description: 'Licensed electricians for wiring, installations and electrical systems',
    services: ['Complete wiring', 'Panel upgrades', 'Smart home setup', 'Emergency repairs'],
    startingPrice: '₹199',
    slug: 'electrical-services',
  },
  {
    icon: PaintBucket,
    title: 'Painting Contractors',
    description: 'Professional painting services for interior and exterior projects',
    services: ['Interior painting', 'Exterior painting', 'Texture work', 'Waterproofing'],
    startingPrice: '₹3,999',
    slug: 'painting-services',
  },
  {
    icon: Hammer,
    title: 'Carpentry Contractors',
    description: 'Skilled carpenters for woodwork, furniture and custom carpentry',
    services: ['Furniture assembly', 'Kitchen cabinets', 'Wardrobes', 'Custom woodwork'],
    startingPrice: '₹499',
    slug: 'carpentry-services',
  },
  {
    icon: BrickWall,
    title: 'Masonry Contractors',
    description: 'Foundation and structural work by experienced masons',
    services: ['Brick masonry', 'Concrete work', 'Tiling', 'Plastering'],
    startingPrice: '₹Contact',
    slug: 'masonry-services',
  },
  {
    icon: Drill,
    title: 'Excavation Contractors',
    description: 'Site preparation and excavation with heavy equipment',
    services: ['Site excavation', 'Foundation work', 'Land grading', 'Trenching'],
    startingPrice: '₹Contact',
    slug: 'excavation-services',
  },
  {
    icon: HardHat,
    title: 'Roofing Contractors',
    description: 'Complete roofing solutions with warranty',
    services: ['Roof installation', 'Leak repair', 'Waterproofing', 'Maintenance'],
    startingPrice: '₹2,999',
    slug: 'roofing-services',
  },
];

const projectTypes = [
  {
    title: 'New Construction',
    description: 'Complete construction services for new residential and commercial buildings',
    features: ['Architectural planning', 'Foundation to finish', 'Quality materials', 'Timeline adherence'],
  },
  {
    title: 'Renovation & Remodeling',
    description: 'Transform existing spaces with professional renovation services',
    features: ['Kitchen remodeling', 'Bathroom renovation', 'Home extensions', 'Interior upgrades'],
  },
  {
    title: 'Commercial Projects',
    description: 'Expert contractors for offices, retail spaces and commercial buildings',
    features: ['Office fit-outs', 'Retail construction', 'Industrial facilities', 'Commercial maintenance'],
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Licensed & Insured',
    description: 'All contractors are licensed, verified and carry proper insurance',
  },
  {
    icon: Users,
    title: '500+ Contractors',
    description: 'Large network of skilled contractors across all trades',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Guaranteed',
    description: 'Workmanship warranty on all construction projects',
  },
  {
    icon: Star,
    title: 'Trusted Network',
    description: '1,000+ completed construction projects with 4.8/5 rating',
  },
];

export function ConstructionServicesPage({ onBack, onBookNow, onNavigate }: ConstructionServicesPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <HardHat className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Construction & Contractor Services</h1>
            </div>
            <p className="text-xl text-slate-100 max-w-3xl leading-relaxed">
              Complete construction ecosystem — from planning to execution. Verified contractors across all trades
              for residential, commercial, and industrial projects.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2 inline" />
                Licensed Contractors
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2 inline" />
                500+ Professionals
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                Quality Guaranteed
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2 inline" />
                1,000+ Projects
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Construction Categories */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Construction Services</h2>
            <p className="text-lg text-gray-600">Expert contractors across all construction trades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {constructionCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all border-2 border-gray-200 hover:border-slate-400 cursor-pointer group"
                  onClick={() => onNavigate(category.slug)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {category.services.map((service, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">Starting from</span>
                    <span className="font-bold text-slate-700 text-lg">{category.startingPrice}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Project Types */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Construction Project Types</h2>
            <p className="text-lg text-gray-600">We handle projects of all sizes and complexities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectTypes.map((project, index) => (
              <Card key={index} className="p-8 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                <ul className="space-y-3">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16 bg-gradient-to-br from-slate-100 to-gray-100 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose VisvasaHome Construction Network?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works for Construction Projects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Construction Projects Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Consultation', desc: 'Discuss project requirements and get free estimate' },
              { step: '2', title: 'Planning', desc: 'Detailed planning, design approval, material selection' },
              { step: '3', title: 'Execution', desc: 'Licensed contractors execute with quality monitoring' },
              { step: '4', title: 'Handover', desc: 'Final inspection, warranty documentation, completion' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-slate-300 rounded-xl p-6 text-center hover:border-slate-500 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-700 text-white rounded-full text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-slate-700 to-slate-900 border-0 p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Have a Construction Project?</h3>
                  <p className="text-slate-200">Get free consultation and quote from our expert contractors</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-white text-slate-900 hover:bg-slate-100 whitespace-nowrap font-semibold"
                  onClick={onBookNow}
                  size="lg"
                >
                  Get Free Quote
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 whitespace-nowrap font-semibold"
                  onClick={() => window.open('tel:+919057567160')}
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-12 text-white">
          <HardHat className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Construction Project?</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with verified, licensed contractors across all trades. Quality work, transparent pricing, timely completion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onBookNow}
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg px-8"
            >
              Book Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8"
              onClick={() => window.open('https://wa.me/919057567160')}
            >
              Chat on WhatsApp
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
