import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Upload, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RegisterContractorProps {
  onBack: () => void;
}

export function RegisterContractor({ onBack }: RegisterContractorProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [categoryKey, setCategoryKey] = useState('painting');
  const [skillsStr, setSkillsStr] = useState('');
  const [experienceYears, setExperienceYears] = useState('3-5');
  const [workDesc, setWorkDesc] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (step !== 4) return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.hash = '#/sp-jobs';
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const getCategoryLabel = (key: string) => {
    switch (key) {
      case 'home-repair': return 'Plumbing';
      case 'cleaning': return 'Cleaning';
      case 'appliance': return 'AC Service';
      case 'painting': return 'Painting';
      case 'outdoor': return 'Painting';
      case 'care': return 'Cleaning';
      case 'interior': return 'Painting';
      case 'event': return 'Painting';
      case 'contractor': return 'Painting';
      default: return 'Painting';
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newProId = `PRO${Math.floor(10000 + Math.random() * 90000)}`;
    const matchedCategory = getCategoryLabel(categoryKey);
    const skillsList = skillsStr 
      ? skillsStr.split(',').map(s => s.trim()).filter(Boolean)
      : ['General Renovation', 'Contracting Work'];

    const newPro = {
      id: newProId,
      name: name || 'Partner Contractor',
      phone: phone || '+91-9876543210',
      email: email || 'partner@visvasahome.com',
      category: matchedCategory,
      location: `${city || 'Jaipur'}, Rajasthan`,
      rating: 5.0,
      totalJobs: 0,
      completionRate: 100,
      revenue: '₹0',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      verified: true,
      experience: `${experienceYears} years`,
      experienceYears: parseInt(experienceYears) || 5,
      responseTimeMinutes: 5,
      skills: skillsList,
      availability: 'Online' as const,
      kycDocType: 'Aadhaar Card',
      kycAgedDays: 0
    };

    const savedPros = localStorage.getItem('visvasahome_professionals');
    const professionalsList = savedPros ? JSON.parse(savedPros) : [];
    
    const existingIndex = professionalsList.findIndex((p: any) => p.phone.replace(/[^\d+]/g, '') === newPro.phone.replace(/[^\d+]/g, ''));
    if (existingIndex !== -1) {
      professionalsList[existingIndex] = { ...professionalsList[existingIndex], ...newPro, id: professionalsList[existingIndex].id };
      localStorage.setItem('visvasahome_partner_id', professionalsList[existingIndex].id);
    } else {
      professionalsList.push(newPro);
      localStorage.setItem('visvasahome_partner_id', newPro.id);
    }
    localStorage.setItem('visvasahome_professionals', JSON.stringify(professionalsList));

    localStorage.setItem('visvasahome_user_role', 'professional');
    localStorage.setItem('visvasahome_user_phone', newPro.phone);
    localStorage.setItem('visvasahome_user_name', newPro.name);
    localStorage.setItem('visvasahome_user_email', newPro.email);
    localStorage.setItem('visvasahome_partner_phone', newPro.phone);
    localStorage.setItem('visvasahome_partner_name', newPro.name);

    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        {step < 4 && (
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="text-sm">Personal Info</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full bg-[#2563EB] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="text-sm">Professional Details</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full bg-[#2563EB] transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="text-sm">Documents</span>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {step < 4 && (
            <>
              <h2 className="mb-2">Register as Professional Contractor</h2>
              <p className="text-gray-600 mb-8">Join VISVASA and build your professional career with local trust</p>
            </>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      placeholder="+91 1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Complete Address *</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <textarea 
                    placeholder="Enter your complete address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">City *</label>
                  <input 
                    type="text" 
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Pincode *</label>
                  <input 
                    type="text" 
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                Continue to Professional Details
              </button>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Primary Service Category *</label>
                <select 
                  value={categoryKey}
                  onChange={(e) => setCategoryKey(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                >
                  <option value="">Select primary service</option>
                  <option value="home-repair">Home Repair & Maintenance</option>
                  <option value="cleaning">Cleaning & Hygiene Services</option>
                  <option value="appliance">Appliance Repair & Installation</option>
                  <option value="painting">Painting, Renovation & Construction</option>
                  <option value="outdoor">Outdoor & Utility Services</option>
                  <option value="care">Care & Support Services</option>
                  <option value="interior">Interior & Design Services</option>
                  <option value="event">Event & Special Services</option>
                  <option value="contractor">Custom Contractor Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Specific Skills *</label>
                <textarea 
                  placeholder="E.g., Electrician, Plumber, AC Repair Specialist"
                  rows={3}
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Years of Experience *</label>
                <select 
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                >
                  <option value="">Select experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Work Description</label>
                <textarea 
                  placeholder="Tell us about your work experience, specializations, and what makes you stand out"
                  rows={4}
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Service Areas (Cities/Localities)</label>
                <input 
                  type="text" 
                  placeholder="E.g., Sector 12, Sector 15, Downtown"
                  value={serviceAreas}
                  onChange={(e) => setServiceAreas(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="flex-1 px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  Continue to Documents
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Profile Photo *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">ID Proof (Aadhaar/PAN/Driving License) *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Work Samples / Portfolio (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload photos of your previous work</p>
                  <p className="text-xs text-gray-500 mt-1">Multiple images allowed (Max 10MB total)</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-900">
                    <p className="mb-2">By registering, you agree to:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Provide quality service to customers</li>
                      <li>Maintain professional conduct</li>
                      <li>Follow VISVASA's terms and conditions</li>
                      <li>Keep your profile and availability updated</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => handleSubmit()}
                  className="flex-1 px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success state */}
          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Application Submitted Successfully!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Thank you for registering, {name || 'Partner'}. Your profile is active under the local simulator dashboard.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto text-left space-y-4">
                <h4 className="font-semibold text-gray-950 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#2563EB]" />
                  What happens next?
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB] font-bold">•</span>
                    <span>Your simulator profile is set up as a <strong>Professional Partner</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB] font-bold">•</span>
                    <span>You can accept new booking requests, manage your schedule, and track earnings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB] font-bold">•</span>
                    <span>Switch roles anytime from your Customer Profile.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-[#2563EB] animate-spin" />
                  <span>Redirecting to jobs portal in {countdown} seconds...</span>
                </div>
                <button
                  onClick={() => {
                    window.location.hash = '#/sp-jobs';
                    window.location.reload();
                  }}
                  className="text-xs text-[#2563EB] hover:underline font-semibold"
                >
                  Click here if you are not redirected automatically
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Reminder */}
        {step < 4 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6 border border-blue-100">
            <h3 className="mb-4">What You'll Get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Local customer base</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Fair pricing protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Professional growth support</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
