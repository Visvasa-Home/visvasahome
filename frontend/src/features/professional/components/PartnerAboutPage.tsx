import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerAboutPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function PartnerAboutPage({ onBack, onNavigate }: PartnerAboutPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">VisvasaHome</div>
                <div className="text-[10px] text-slate-500 -mt-1">Partner Portal</div>
              </div>
            </div>
          </div>
          <Button size="sm" className="bg-[#2563EB] hover:bg-[#d95a1e]" onClick={() => onNavigate('partner-home')}>
            Register Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl mb-6">About VisvasaHome Partners</h1>
          <p className="text-xl text-white/90">
            Building India's largest ecosystem of verified service professionals
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl mb-4">Our Story</h2>
                <p className="text-slate-600 mb-4">
                  VisvasaHome was founded with a simple mission: to organize and empower India's skilled service professionals while making quality home services accessible, reliable, and trustworthy for every household.
                </p>
                <p className="text-slate-600 mb-4">
                  We recognized that millions of talented electricians, plumbers, carpenters, beauticians, and other service professionals work without formal recognition, stable income, or growth opportunities. At the same time, customers struggle to find reliable, verified professionals they can trust.
                </p>
                <p className="text-slate-600">
                  Today, we're India's fastest-growing local services platform with 50,000+ verified partners across 20+ cities, completing over 100,000 services monthly. Our partners earn an average of ₹45,000/month, many achieving financial stability for the first time in their careers.
                </p>
              </CardContent>
            </Card>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl mb-3">Our Mission</h3>
                  <p className="text-slate-600">
                    To create sustainable livelihoods for service professionals by providing them with verified status, regular work, fair compensation, and career development opportunities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl mb-3">Our Vision</h3>
                  <p className="text-slate-600">
                    To become India's most trusted service professional network, where every skilled worker has dignified employment and every customer receives quality service.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Values */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl mb-6">Our Values</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Professional Dignity</h3>
                      <p className="text-slate-600">
                        Every service professional deserves respect, fair treatment, and recognition for their skills and expertise.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Community First</h3>
                      <p className="text-slate-600">
                        We prioritize the well-being of our partner community through insurance, support systems, and welfare programs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Continuous Growth</h3>
                      <p className="text-slate-600">
                        We invest in training, certification, and skill development so partners can advance their careers and earnings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Transparency & Trust</h3>
                      <p className="text-slate-600">
                        Clear pricing, honest communication, and verified credentials build trust between professionals and customers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Offer */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl mb-6">What We Offer Our Partners</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg mb-2">Income & Growth</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Regular job assignments in your area</li>
                      <li>• ₹30,000–₹90,000/month earning potential</li>
                      <li>• AMC subscription income streams</li>
                      <li>• Weekly payouts with zero delays</li>
                      <li>• Performance-based incentives</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg mb-2">Support & Benefits</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Free registration and onboarding</li>
                      <li>• Accident insurance coverage</li>
                      <li>• Health benefits for active partners</li>
                      <li>• 24/7 partner support helpline</li>
                      <li>• Tools and equipment procurement</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg mb-2">Training & Development</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Free skill development programs</li>
                      <li>• Industry certifications</li>
                      <li>• Advanced training workshops</li>
                      <li>• Safety and compliance training</li>
                      <li>• Digital tools training</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg mb-2">Professional Recognition</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Verified professional badge</li>
                      <li>• Digital professional profile</li>
                      <li>• Customer ratings & reviews</li>
                      <li>• Performance awards & recognition</li>
                      <li>• Career advancement opportunities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl mb-6">Our Impact</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl text-[#2563EB] mb-2">50,000+</div>
                    <div className="text-slate-600 text-sm">Active Partners</div>
                  </div>
                  <div>
                    <div className="text-3xl text-[#2563EB] mb-2">₹225Cr+</div>
                    <div className="text-slate-600 text-sm">Partner Earnings (FY25)</div>
                  </div>
                  <div>
                    <div className="text-3xl text-[#2563EB] mb-2">100K+</div>
                    <div className="text-slate-600 text-sm">Monthly Services</div>
                  </div>
                  <div>
                    <div className="text-3xl text-[#2563EB] mb-2">4.8/5</div>
                    <div className="text-slate-600 text-sm">Partner Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-white/90 mb-8">
            Start your journey as a verified professional today
          </p>
          <Button size="lg" className="bg-white text-[#2563EB] hover:bg-slate-100" onClick={() => onNavigate('partner-home')}>
            Register as Partner
          </Button>
        </div>
      </section>
    </div>
  );
}
