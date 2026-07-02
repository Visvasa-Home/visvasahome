import { 
  ArrowRight, Users, TrendingUp, Shield, Clock, Award, CheckCircle, MapPin, Wrench,
  Download, FileText, ShieldAlert, XCircle, BookOpen, Zap, AlertTriangle, ChevronRight, GraduationCap
} from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { useState } from 'react';

const partnerOnboardingStages = [
  {
    id: 1,
    title: 'Download & register',
    subtitle: 'Partner app, basic details',
    icon: Download,
    description: 'Download the VisvasaHome Partner App from the Play Store/App Store. Fill out your basic business profile, select your operational categories, and verify your mobile number.',
    metric: 'Estimated time: 5 minutes'
  },
  {
    id: 2,
    title: 'Submit profile & ID docs',
    subtitle: 'Category, location, identity',
    icon: FileText,
    description: 'Upload necessary professional KYC documents including Aadhaar card, PAN card, address proof, bank details for payouts, and business certifications (if any).',
    metric: 'Verification turnaround: 24 hours'
  },
  {
    id: 3,
    title: 'Background verification',
    subtitle: 'Third-party check, e.g. AuthBridge',
    icon: ShieldAlert,
    description: 'To guarantee customer safety, we partner with AuthBridge to conduct background verification including address checks, criminal record verification, and reference checks.',
    metric: '100% mandatory compliance check'
  },
  {
    id: 4,
    title: 'In-person interview',
    subtitle: 'Category manager, behaviour check',
    icon: Users,
    description: 'Attend a scheduled physical interview with our Local Category Manager. We evaluate communication, professionalism, and behavioral alignment with VisvasaHome values.',
    metric: 'Assesses soft skills and customer service'
  },
  {
    id: 5,
    title: 'Skill test',
    subtitle: 'Practical assessment by trainers',
    icon: Award,
    description: 'Perform a hands-on practical assessment at our regional training center. Your technical capabilities are evaluated by certified master trainers.',
    metric: 'Requires 80%+ practical score'
  },
  {
    id: 6,
    title: 'Not selected',
    subtitle: 'Rigorous filter gate (~70-75% rejected)',
    icon: XCircle,
    isFilterGate: true,
    description: 'Rigorous selection standards mean only the top 25-30% of applicants successfully qualify past the verification and skill assessment gates. Candidates who do not meet our standards are not onboarded.',
    metric: '70% - 75% applicant rejection rate'
  },
  {
    id: 7,
    title: 'Training program',
    subtitle: '3-45 days, skill-dependent',
    icon: GraduationCap,
    description: 'Qualifying partners enter an intensive training curriculum at the Visvasa Academy. The course covers technical refinement, advanced diagnostics, and tool handling.',
    metric: 'Duration: 3 to 45 days (skill-based)'
  },
  {
    id: 8,
    title: 'Safety & SOP module',
    subtitle: 'Equipment, protocols, SafeSteps',
    icon: Shield,
    description: 'Mandatory certification in the SafeSteps Safety Protocol. Partners learn about personal protective equipment (PPE), contactless services, clean-up requirements, and emergency response SOPs.',
    metric: 'Includes safety kit provisioning'
  },
  {
    id: 9,
    title: 'Tools & consumables setup',
    subtitle: 'Partnered brand supplies',
    icon: Wrench,
    description: 'Get equipped with official Visvasa branded uniforms, tools, and high-quality consumables sourced directly from partnered premium brands.',
    metric: 'Subsidized starter kit pricing'
  },
  {
    id: 10,
    title: 'Go live',
    subtitle: 'Profile active, jobs visible',
    icon: Zap,
    description: 'Your profile goes live on the platform! The system matches you with bookings inside your preferred service radius. Turn on your active state and start earning.',
    metric: 'Instant digital payouts enabled'
  },
  {
    id: 11,
    title: 'Growth track',
    subtitle: 'SME, then part-time trainer',
    icon: TrendingUp,
    description: 'Continuous growth path. High-performing partners receive promotion opportunities to become Subject Matter Experts (SMEs), field inspectors, and eventually part-time trainers at the academy.',
    metric: '1.5x earning potential multiplier'
  }
];

interface PartnerHomePageProps {
  onNavigate: (page: string) => void;
}

export function PartnerHomePage({ onNavigate }: PartnerHomePageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    service: '',
    experience: '',
  });
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partner Registration:', formData);
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <div className="font-semibold text-slate-900">VisvasaHome</div>
              <div className="text-[10px] text-slate-500 -mt-1">Partner Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('partner-login')}>
              Login
            </Button>
            <Button size="sm" className="bg-[#2563EB] hover:bg-[#d95a1e]">
              Register Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl mb-4">
                Join India's Most Trusted Service Professional Network
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Earn ₹30,000–₹90,000/month as a verified professional. Free registration, flexible hours, fair pay, and career growth.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verified Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Weekly Payouts</span>
                </div>
              </div>
              <Button size="lg" className="bg-white text-[#2563EB] hover:bg-slate-100">
                Start Earning Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Registration Form */}
            <Card className="bg-white text-slate-900">
              <CardContent className="p-6">
                <h3 className="text-2xl mb-6">Quick Registration</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jaipur">Jaipur</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service">Service Category *</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="ac-service">AC Service & Repair</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="appliance">Appliance Repair</SelectItem>
                        <SelectItem value="beauty">Beauty Services</SelectItem>
                        <SelectItem value="carpentry">Carpentry</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="pest-control">Pest Control</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience *</Label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#d95a1e]">
                    Register as Partner
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    By registering, you agree to our{' '}
                    <button type="button" onClick={() => onNavigate('partner-terms')} className="text-[#2563EB] underline">
                      Terms & Conditions
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl text-[#2563EB] mb-2">50,000+</div>
              <div className="text-slate-600">Active Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#2563EB] mb-2">₹45K</div>
              <div className="text-slate-600">Avg. Monthly Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#2563EB] mb-2">20+</div>
              <div className="text-slate-600">Cities Active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#2563EB] mb-2">4.8/5</div>
              <div className="text-slate-600">Partner Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Why Partner with VisvasaHome?</h2>
            <p className="text-slate-600 text-lg">
              Join India's most trusted service professional network
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl mb-2">Steady Income</h3>
                <p className="text-slate-600">
                  Earn ₹30,000–₹90,000/month with regular job assignments and AMC income streams
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl mb-2">Free Training</h3>
                <p className="text-slate-600">
                  Access skill development programs, certifications, and ongoing professional support
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl mb-2">Flexible Hours</h3>
                <p className="text-slate-600">
                  Work on your schedule. Accept jobs when you want, maintain work-life balance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl mb-2">Verified Badge</h3>
                <p className="text-slate-600">
                  Get verified professional status and build trust with customers across India
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl mb-2">Insurance Coverage</h3>
                <p className="text-slate-600">
                  Accident insurance and health benefits for active partners at no cost
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl mb-2">Tools & Equipment</h3>
                <p className="text-slate-600">
                  Access to affordable tools, equipment rentals, and product procurement support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Onboarding Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-50 text-[#2563EB] rounded-full mb-4">
              <span className="text-sm font-medium">Partner Journey Funnel</span>
            </div>
            <h2 className="text-3xl md:text-4xl mb-4 font-semibold text-slate-900">How to Get Started: The 11-Stage Onboarding</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our comprehensive pipeline ensures elite standards. Click on any stage below to inspect requirements, timelines, and career tracks.
            </p>
          </div>

          {/* Horizontal Progress Track (Scrollable on mobile) */}
          <div className="mb-12 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
            <div className="flex items-center min-w-[1000px] justify-between relative px-4">
              {/* Connector line behind circles */}
              <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              
              {partnerOnboardingStages.map((stage) => {
                const isActive = activeStep === stage.id;
                const isCompleted = activeStep > stage.id;
                const isFilter = stage.isFilterGate;
                const Icon = stage.icon;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStep(stage.id)}
                    className="flex flex-col items-center relative z-10 focus:outline-none group"
                  >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive 
                        ? isFilter 
                          ? 'bg-red-500 border-red-600 text-white shadow-lg ring-4 ring-red-500/20 scale-110'
                          : 'bg-[#2563EB] border-[#1D4ED8] text-white shadow-lg ring-4 ring-blue-500/20 scale-110'
                        : isCompleted
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : isFilter
                            ? 'bg-white border-red-300 text-red-500 hover:border-red-400'
                            : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${
                      isActive 
                        ? isFilter ? 'text-red-600' : 'text-[#2563EB]'
                        : isFilter ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      Stage {stage.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 hidden md:block max-w-[90px] text-center truncate mt-0.5">
                      {stage.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Inspector Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Vertical Step selector list */}
            <div className="lg:col-span-5 space-y-2">
              {partnerOnboardingStages.map((stage) => {
                const isActive = activeStep === stage.id;
                const isFilter = stage.isFilterGate;
                
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStep(stage.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                      isActive 
                        ? isFilter 
                          ? 'bg-red-50 border-red-200 text-red-900 shadow-sm'
                          : 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
                        : isFilter
                          ? 'bg-white border-red-100 hover:bg-red-50/30 text-red-700'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isActive
                          ? isFilter ? 'bg-red-600 text-white' : 'bg-[#2563EB] text-white'
                          : isFilter ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {stage.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{stage.title}</h4>
                        <p className="text-xs opacity-80 truncate max-w-[240px]">{stage.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isFilter && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase">
                          Gate
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 opacity-40 group-hover:opacity-100 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed Card Showcase */}
            <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm">
              {(() => {
                const stage = partnerOnboardingStages.find(s => s.id === activeStep) || partnerOnboardingStages[0];
                const Icon = stage.icon;
                const isFilter = stage.isFilterGate;
                
                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isFilter ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#2563EB]'
                      }`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isFilter ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          Stage {stage.id} of 11 — {isFilter ? 'Rigorous Selection Gate' : 'Onboarding Pipeline'}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-905 mt-1">{stage.title}</h3>
                      </div>
                    </div>

                    {/* Warning Box for Stage 6 */}
                    {isFilter && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-800">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                        <div>
                          <span className="font-bold text-sm block">Rigorous Quality Check</span>
                          <p className="text-xs text-red-700 leading-relaxed mt-0.5">
                            VisvasaHome enforces very strict safety and performance controls. Approximately 70% to 75% of applicants are rejected at this stage based on background details, reference failures, or insufficient practical score.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Body */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Description</span>
                        <p className="text-sm text-slate-700 leading-relaxed">{stage.description}</p>
                      </div>

                      {/* Checklist */}
                      <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Key Requirements & Tasks</span>
                        <ul className="space-y-2 text-sm text-slate-600">
                          {stage.id === 1 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Android or iOS smartphone with active cellular data</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Valid Indian mobile number for OTP verification</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Entry of service catalog specialization (e.g. AC service, carpentry)</span></li>
                            </>
                          )}
                          {stage.id === 2 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Aadhaar Card (identity proof) and PAN Card (tax registration)</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Valid bank account passbook or cancelled cheque (for payouts)</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Address proof (electricity bill, rent agreement)</span></li>
                            </>
                          )}
                          {stage.id === 3 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Consent check for criminal background clearance</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Address verification by third-party field agents (e.g. AuthBridge)</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Verification of academic credentials or professional references</span></li>
                            </>
                          )}
                          {stage.id === 4 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Personal grooming and behavioral audit</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Basic customer communication skills check</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Consent verification on code of conduct and service guidelines</span></li>
                            </>
                          )}
                          {stage.id === 5 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Physical demo of core skills (e.g. welding, circuit diagnostics)</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Evaluated by senior master trainers in our hub</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Requires minimum score of 80% to proceed to academy</span></li>
                            </>
                          )}
                          {stage.id === 6 && (
                            <>
                              <li className="flex items-start gap-2">⚠️ <span className="text-xs">Automatic exit interview and profile storage (if candidate re-applies)</span></li>
                              <li className="flex items-start gap-2">⚠️ <span className="text-xs">App notifications indicating check failure and recommendations</span></li>
                            </>
                          )}
                          {stage.id === 7 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Access to Visvasa academy portal</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Technical troubleshooting and advanced diagnosis classes</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Practical exams on electrical systems and modern repairs</span></li>
                            </>
                          )}
                          {stage.id === 8 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Use of safety gloves, safety shoes, goggles, and branded uniforms</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Contactless onboarding protocol check</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">100% score required on safety assessment questionnaire</span></li>
                            </>
                          )}
                          {stage.id === 9 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Provisioning of heavy diagnostic equipment</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Standardized lubricants, tape, and official consumables kit</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Payment setup for kit security deposit (subsidized)</span></li>
                            </>
                          )}
                          {stage.id === 10 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Active status toggle in the partner mobile application</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">GPS mapping enabled for local booking triggers</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Visible verified badge on customer catalog</span></li>
                            </>
                          )}
                          {stage.id === 11 && (
                            <>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Consistent active service history (minimum 6 months)</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Maintain average rating above 4.75 stars</span></li>
                              <li className="flex items-start gap-2">✓ <span className="text-xs">Promotion to Subject Matter Expert (SME) with training payouts</span></li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Timeline metric indicator */}
                    <div className="flex items-center justify-between p-4 bg-slate-200/50 rounded-2xl text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Timeline / Metric:
                      </span>
                      <span className="text-[#2563EB]">{stage.metric}</span>
                    </div>

                    <div className="pt-2">
                      <Button onClick={() => onNavigate('partner-login')} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                        Proceed with Registration <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      </section>

      {/* City Selection */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Partner with Us in Your City</h2>
            <p className="text-slate-600 text-lg">We're actively onboarding partners in these cities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Jaipur', jobs: '2,500+ jobs/month' },
              { name: 'Delhi', jobs: '8,500+ jobs/month' },
              { name: 'Mumbai', jobs: '12,000+ jobs/month' },
              { name: 'Bangalore', jobs: '9,500+ jobs/month' },
              { name: 'Pune', jobs: '4,500+ jobs/month' },
              { name: 'Hyderabad', jobs: '5,500+ jobs/month' },
              { name: 'Chennai', jobs: '4,000+ jobs/month' },
              { name: 'Ahmedabad', jobs: '3,500+ jobs/month' },
            ].map((city) => (
              <Card key={city.name} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate(`partner-city-${city.name.toLowerCase()}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#2563EB] mt-1" />
                    <div>
                      <div className="font-semibold">{city.name}</div>
                      <div className="text-sm text-slate-500">{city.jobs}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 50,000+ service professionals earning with VisvasaHome
          </p>
          <Button size="lg" className="bg-white text-[#2563EB] hover:bg-slate-100">
            Register Now - It's Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-semibold">VisvasaHome Partners</span>
              </div>
              <p className="text-slate-400 text-sm">
                India's most trusted service professional network
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button onClick={() => onNavigate('partner-about')} className="hover:text-white">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('partner-login')} className="hover:text-white">
                    Partner Login
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('partner-faq')} className="hover:text-white">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Policies</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button onClick={() => onNavigate('partner-terms')} className="hover:text-white">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('partner-privacy')} className="hover:text-white">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('partner-anti-discrimination')} className="hover:text-white">
                    Anti Discrimination Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('partner-info-security')} className="hover:text-white">
                    Information Security Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('partner-welfare')} className="hover:text-white">
                    Service Professionals Welfare Policy
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Email: partners@visvasahome.com</li>
                <li>Phone: 1800-XXX-XXXX</li>
                <li>Hours: Mon-Sat, 9 AM - 6 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Visvasa Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
