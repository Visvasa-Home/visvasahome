'use client';

import { Hero } from '../../src/app/components/Hero';
import { HomeCategories } from '../../src/app/components/HomeCategories';
import { ServicesOffered } from '../../src/app/components/ServicesOffered';
import { Differentiation } from '../../src/app/components/Differentiation';
import { TestimonialsSection } from '../../src/app/components/TestimonialsSection';
import { Footer } from '../../src/app/components/Footer';
import { Header } from '../../src/app/components/Header';

export default function MarketingPage() {
  const dummyNavigate = (page: string) => {
    // Falls back to SPA hash router for transitional compatibility
    window.location.hash = `#/${page}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onRegisterContractor={() => dummyNavigate('register-contractor')}
        onBookService={() => dummyNavigate('get-started-customer')}
        selectedLocation={null}
        onLocationSelect={() => {}}
        onAMCOffice={() => dummyNavigate('amc-office')}
        onAMCHome={() => dummyNavigate('amc-home')}
        onAMCCommercial={() => dummyNavigate('amc-commercial')}
        onAMCIndustrial={() => dummyNavigate('amc-industrial')}
        onAMCHealthcare={() => dummyNavigate('amc-healthcare')}
        onAMCEducational={() => dummyNavigate('amc-educational')}
        onAMCHospitality={() => dummyNavigate('amc-hospitality')}
        onAMCSociety={() => dummyNavigate('amc-society')}
        onHome={() => dummyNavigate('home')}
      />
      <Hero onNavigate={dummyNavigate} />
      <HomeCategories onNavigate={dummyNavigate} />
      <ServicesOffered onNavigate={dummyNavigate} />
      <Differentiation />
      <TestimonialsSection />
      <Footer onNavigate={dummyNavigate} />
    </div>
  );
}
