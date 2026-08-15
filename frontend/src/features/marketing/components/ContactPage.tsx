import { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface ContactPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const serviceTypes = [
  'AC Service & Repair',
  'Plumbing',
  'Electrical Work',
  'Home Deep Cleaning',
  'Appliance Repair',
  'Pest Control',
  'General Handyman / Repair',
  'RO & Chimney Service',
  'Home Security (CCTV/Smart Lock)',
  'Home Improvement',
  'Wall Painting',
  'Carpentry & Woodwork',
  'Masonry & Tiling',
  'Interior Design',
  'Flooring Services',
  'Roofing & Waterproofing',
  'Full Home Renovation',
  'Excavation & Site Work',
  'Home AMC Plan',
  'Office / Commercial AMC',
  'Contractor Registration',
  'Other / General Enquiry',
];

const officeLocations = [
  {
    city: 'Jaipur (Registered Office)',
    address: 'Visvasahome Private Limited\nJaipur, Rajasthan, India — 302001',
    phone: '+91 905 7567 160',
    email: 'contact@visvasahome.com',
    hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
  },
];

export function ContactPage({ onBack, onNavigate }: ContactPageProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', serviceType: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onRegisterContractor={() => onNavigate('register-contractor')}
        onBookService={() => onNavigate('get-started-customer')}
        selectedLocation={null}
        onLocationSelect={() => {}}
        onAMCOffice={() => onNavigate('amc-office')}
        onAMCHome={() => onNavigate('amc-home')}
        onAMCCommercial={() => onNavigate('amc-commercial')}
        onAMCIndustrial={() => onNavigate('amc-industrial')}
        onAMCHealthcare={() => onNavigate('amc-healthcare')}
        onAMCEducational={() => onNavigate('amc-educational')}
        onAMCHospitality={() => onNavigate('amc-hospitality')}
        onAMCSociety={() => onNavigate('amc-society')}
        onHome={onBack}
      />

      {/* Legal Operator Notice */}
      <div className="bg-gray-950 text-gray-300 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          This website is operated by <strong className="text-white">Visvasahome Private Limited</strong>, a company registered in India. Registered Office: Jaipur, Rajasthan, India — 302001. &nbsp;|&nbsp; Email: contact@visvasahome.com &nbsp;|&nbsp; Phone: +91 905 7567 160
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="text-sm">Get in Touch</span>
            </div>
            <h1 className="text-4xl font-semibold mb-6 text-white">Contact VisvasaHome</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Whether you're a customer looking to book a service, a professional ready to join our network, or a business exploring AMC contracts — we're here to help. Reach out and we'll respond promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Strips */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="https://wa.me/919057567160"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">WhatsApp Us</p>
                <p className="text-sm text-gray-600">Quick response</p>
              </div>
            </a>

            <a
              href="tel:+919057567160"
              className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#2563EB] font-medium">Call Directly</p>
                <p className="text-sm text-gray-600">+91 905 7567 160</p>
              </div>
            </a>

            <a
              href="mailto:contact@visvasahome.com"
              className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Email Us</p>
                <p className="text-sm text-gray-600">contact@visvasahome.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Working Hours</p>
                <p className="text-sm text-gray-600">Mon–Sat, 9AM–7PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and our team will reach out within 4 hours on business days.</p>

              {submitted ? (
                <div className="text-center py-16">
                  <div className="inline-flex p-5 bg-blue-100 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Message Received!</h3>
                  <p className="text-gray-600 mb-6">Thank you for reaching out. A VisvasaHome representative will contact you within 4 hours.</p>
                  <a
                    href="https://wa.me/919057567160"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp for Faster Response
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 00000 00000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Type *</label>
                    <select
                      required
                      value={form.serviceType}
                      onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    >
                      <option value="">Select a service category</option>
                      {serviceTypes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your requirement, preferred timing, location, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to be contacted by VisvasaHome regarding your enquiry.
                  </p>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Office Locations */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Office</h2>
                {officeLocations.map((office, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{office.city}</h3>
                        <p className="text-sm text-gray-600 mb-3">{office.address}</p>
                        <div className="space-y-1.5">
                          <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-[#2563EB] hover:text-blue-800">
                            <Phone className="w-4 h-4" /> {office.phone}
                          </a>
                          <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-sm text-[#2563EB] hover:text-blue-800">
                            <Mail className="w-4 h-4" /> {office.email}
                          </a>
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" /> {office.hours}
                          </p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Grievance Redressal Officer</p>
                            <p className="text-xs text-gray-600">Name: Kunal Mittal</p>
                            <p className="text-xs text-gray-600">Email: grievance@visvasahome.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cities We Serve */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cities We Serve</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Jaipur', 'Delhi NCR', 'Mumbai', 'Bengaluru',
                    'Hyderabad', 'Pune', 'Chennai', 'Kolkata',
                    'Ahmedabad', 'Surat', 'Noida', 'Gurgaon',
                    'Lucknow', 'Chandigarh', 'Bhopal', 'Indore',
                  ].map((city) => (
                    <div key={city} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {city}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#2563EB] mt-4">+ More cities expanding soon. Contact us to check availability in your area.</p>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Prefer WhatsApp?</h3>
                <p className="text-blue-100 text-sm mb-4">Message us directly on WhatsApp for the fastest response. Our team typically replies within 30 minutes during business hours.</p>
                <a
                  href="https://wa.me/919057567160"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Questions</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Before reaching out, you might find your answer in our FAQ section. We've compiled answers to the most common customer and contractor questions.</p>
          <button
            onClick={() => onNavigate('faq')}
            className="px-8 py-3 border border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse FAQs
          </button>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
