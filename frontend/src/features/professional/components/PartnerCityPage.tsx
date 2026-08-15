import { ArrowLeft, MapPin, Users, TrendingUp, Briefcase, Clock, Award, Phone } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerCityPageProps {
  city: string;
  onBack: () => void;
  onRegister: () => void;
}

// City-specific data
const cityData: Record<string, {
  fullName: string;
  activePartners: string;
  monthlyJobs: string;
  avgEarnings: string;
  topServices: string[];
  localLanguages: string[];
  demographics: string;
  opportunities: string[];
}> = {
  jaipur: {
    fullName: 'Jaipur',
    activePartners: '3,200+',
    monthlyJobs: '2,500+',
    avgEarnings: '₹42,000',
    topServices: ['Plumbing', 'Electrical', 'AC Service', 'Home Cleaning', 'Painting'],
    localLanguages: ['Hindi', 'Rajasthani'],
    demographics: '1.5M households in Pink City and suburbs',
    opportunities: [
      'Growing heritage tourism sector needs hospitality services',
      'New residential colonies in Jagatpura, Vaishali Nagar expanding demand',
      'Commercial growth in Malviya Nagar and Sitapura Industrial Area',
      'AMC opportunities in Jaipur\'s 500+ apartment societies',
    ],
  },
  delhi: {
    fullName: 'Delhi NCR',
    activePartners: '12,000+',
    monthlyJobs: '8,500+',
    avgEarnings: '₹52,000',
    topServices: ['AC Service', 'Home Cleaning', 'Appliance Repair', 'Electrical', 'Beauty Services'],
    localLanguages: ['Hindi', 'Punjabi', 'English'],
    demographics: '4M+ households across Delhi NCR (Delhi, Noida, Gurgaon, Ghaziabad)',
    opportunities: [
      'High-density metro cities with constant service demand',
      'Premium clientele in Gurgaon and South Delhi areas',
      'Corporate office maintenance contracts in Connaught Place, Nehru Place',
      'Expatriate community requires English-speaking professionals',
    ],
  },
  mumbai: {
    fullName: 'Mumbai',
    activePartners: '15,000+',
    monthlyJobs: '12,000+',
    avgEarnings: '₹58,000',
    topServices: ['Plumbing', 'AC Service', 'Home Cleaning', 'Pest Control', 'Appliance Repair'],
    localLanguages: ['Hindi', 'Marathi', 'English'],
    demographics: '3M+ households in Mumbai and Thane region',
    opportunities: [
      'Highest earning potential in India due to premium pricing',
      'Year-round AC and pest control demand due to coastal climate',
      'High-rise buildings in BKC, Worli, Andheri need specialized services',
      'Growing Navi Mumbai and Thane suburbs with new constructions',
    ],
  },
  bangalore: {
    fullName: 'Bangalore',
    activePartners: '10,500+',
    monthlyJobs: '9,500+',
    avgEarnings: '₹51,000',
    topServices: ['Home Cleaning', 'AC Service', 'Electrical', 'Interior Design', 'Appliance Repair'],
    localLanguages: ['Kannada', 'English', 'Tamil', 'Hindi'],
    demographics: '2.5M+ households in Bangalore urban and suburbs',
    opportunities: [
      'Tech-savvy customers prefer digital service bookings',
      'Young professionals in Whitefield, Electronic City need home services',
      'Premium villa projects in Sarjapur Road, Hennur require specialized contractors',
      'International clientele in Indiranagar, Koramangala',
    ],
  },
  pune: {
    fullName: 'Pune',
    activePartners: '5,500+',
    monthlyJobs: '4,500+',
    avgEarnings: '₹46,000',
    topServices: ['Plumbing', 'Home Cleaning', 'AC Service', 'Painting', 'Electrical'],
    localLanguages: ['Marathi', 'Hindi', 'English'],
    demographics: '1.2M+ households in Pune and Pimpri-Chinchwad',
    opportunities: [
      'Growing IT hub with young professional demographic',
      'New residential projects in Hinjewadi, Wakad, Baner',
      'Educational institutions need maintenance contracts',
      'Manufacturing units in Pimpri-Chinchwad for industrial services',
    ],
  },
  hyderabad: {
    fullName: 'Hyderabad',
    activePartners: '7,000+',
    monthlyJobs: '5,500+',
    avgEarnings: '₹48,000',
    topServices: ['AC Service', 'Home Cleaning', 'Plumbing', 'Pest Control', 'Electrical'],
    localLanguages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    demographics: '1.8M+ households in Hyderabad and Secunderabad',
    opportunities: [
      'Rapidly growing Gachibowli IT corridor with premium clientele',
      'New residential townships in Kompally, Miyapur areas',
      'Healthcare institutions need specialized maintenance',
      'Pharma industries in Genome Valley for industrial contracts',
    ],
  },
};

export function PartnerCityPage({ city, onBack, onRegister }: PartnerCityPageProps) {
  const data = cityData[city.toLowerCase()] || cityData['jaipur'];

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
          <Button size="sm" className="bg-[#2563EB] hover:bg-[#d95a1e]" onClick={onRegister}>
            Register Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8" />
            <h1 className="text-4xl lg:text-5xl">Partner with Us in {data.fullName}</h1>
          </div>
          <p className="text-xl text-white/90 mb-8">
            Join {data.activePartners} service professionals earning an average of {data.avgEarnings}/month in {data.fullName}
          </p>
          <Button size="lg" className="bg-white text-[#2563EB] hover:bg-slate-100" onClick={onRegister}>
            Start Earning in {data.fullName}
          </Button>
        </div>
      </section>

      {/* City Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div className="text-3xl text-[#2563EB] mb-2">{data.activePartners}</div>
              <div className="text-slate-600">Active Partners</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div className="text-3xl text-[#2563EB] mb-2">{data.monthlyJobs}</div>
              <div className="text-slate-600">Jobs/Month</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div className="text-3xl text-[#2563EB] mb-2">{data.avgEarnings}</div>
              <div className="text-slate-600">Avg. Monthly Earnings</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div className="text-3xl text-[#2563EB] mb-2">24/7</div>
              <div className="text-slate-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8">Why Partner in {data.fullName}?</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2563EB]" />
                  Market Demographics
                </h3>
                <p className="text-slate-600">{data.demographics}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#2563EB]" />
                  Top Service Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.topServices.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Growth Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8">Growth Opportunities in {data.fullName}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.opportunities.map((opportunity, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <p className="text-slate-600">{opportunity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl mb-4">Local Language Support</h2>
              <p className="text-slate-600 mb-4">
                Our Partner app and support team are available in:
              </p>
              <div className="flex flex-wrap gap-3">
                {data.localLanguages.map((lang, index) => (
                  <span key={index} className="px-4 py-2 bg-white border border-[#2563EB] text-[#2563EB] rounded-lg font-semibold">
                    {lang}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Story (Generic) */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8 text-center">Partner Success Story from {data.fullName}</h2>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Rajesh Kumar, Electrician</h3>
                  <p className="text-slate-600 mb-4">
                    "I joined VisvasaHome as a Partner 2 years ago in {data.fullName}. Initially, I was earning ₹15,000-₹20,000/month with irregular work. Today, with consistent job flow and AMC subscriptions, I earn ₹55,000-₹60,000/month. The best part is the respect and professional recognition. I've completed over 800 jobs with a 4.9 rating, and customers trust me because of the VisvasaHome verified badge. My family's life has completely transformed."
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>• 2 years with VisvasaHome</span>
                    <span>• 800+ completed jobs</span>
                    <span>• 4.9★ rating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Local Contact */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl mb-4">Get in Touch with Our {data.fullName} Team</h2>
              <p className="text-slate-600 mb-6">
                Have questions about partnering in {data.fullName}? Our local team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="outline" size="lg" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Call: 1800-XXX-XXXX
                </Button>
                <Button size="lg" className="bg-[#2563EB] hover:bg-[#d95a1e]" onClick={onRegister}>
                  Register as Partner in {data.fullName}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-4">
            Ready to Start Earning in {data.fullName}?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join {data.activePartners} Partners already earning with VisvasaHome
          </p>
          <Button size="lg" className="bg-white text-[#2563EB] hover:bg-slate-100" onClick={onRegister}>
            Register Now - Free & Fast
          </Button>
        </div>
      </section>
    </div>
  );
}
