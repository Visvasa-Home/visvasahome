import image_vh_logo from '../../imports/logo.png';
import { Instagram, Facebook, Youtube, Linkedin, Phone, Mail, MapPin, Shield, Star, Clock, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onRegisterContractor?: () => void;
}

const NAV_CUSTOMER = [
  { label: 'Book a Service', page: 'get-started-customer' },
  { label: 'How It Works', page: 'how-it-works' },
  { label: 'Home AMC Plans', page: 'amc-home' },
  { label: 'Services & Pricing', page: 'services-pricing' },
  { label: 'Customer Reviews', page: 'testimonials' },
  { label: 'FAQs', page: 'faq' },
  { label: 'Customer Support', page: 'contact' },
];

const NAV_PROFESSIONAL = [
  { label: 'Join as Professional', page: 'professional-register', highlight: true },
  { label: 'Benefits & Earnings', page: 'benefits' },
  { label: 'Training & Support', page: 'training-support' },
  { label: 'Success Stories', page: 'success-stories' },
];

const NAV_COMPANY = [
  { label: 'About Us', page: 'about-us' },
  { label: 'Our Mission', page: 'our-mission' },
  { label: 'Why Choose Us', page: 'competitive-analysis' },
  { label: 'Investor Relations', page: 'investor-relations' },
  { label: 'Careers', page: 'careers' },
  { label: 'Tips & Guides', page: 'blog' },
  { label: 'Contact Us', page: 'contact' },
];

const SERVICES = [
  { label: 'AC Service', page: 'ac-services' },
  { label: 'Plumbing', page: 'plumbing-services' },
  { label: 'Electrical', page: 'electrical-services' },
  { label: 'Handyman', page: 'general-repair' },
  { label: 'Appliance Repair', page: 'appliance-repair' },
  { label: 'Pest Control', page: 'pest-control' },
  { label: 'Home Cleaning', page: 'cleaning-services' },
  { label: 'Painting', page: 'painting-services' },
  { label: 'Carpentry', page: 'carpentry-services' },
  { label: 'Interior Design', page: 'interior-design' },
  { label: 'Landscaping', page: 'landscaping-services' },
  { label: 'Flooring', page: 'flooring-services' },
  { label: 'Beauty & Salon', page: 'beauty-services' },
  { label: 'Wellness', page: 'wellness-services' },
  { label: 'Event Setup', page: 'event-services' },
  { label: 'Home AMC', page: 'amc-home' },
  { label: 'Office AMC', page: 'amc-office' },
  { label: 'Society AMC', page: 'amc-society' },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/visvasa_home_/?hl=en',
    icon: <Instagram className="w-4 h-4" />,
    color: 'hover:bg-pink-600',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Visvasaheritage/',
    icon: <Facebook className="w-4 h-4" />,
    color: 'hover:bg-blue-700',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@visvasahomes',
    icon: <Youtube className="w-4 h-4" />,
    color: 'hover:bg-red-600',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/110911374/admin/dashboard/',
    icon: <Linkedin className="w-4 h-4" />,
    color: 'hover:bg-blue-600',
  },
];

export function Footer({ onNavigate, onRegisterContractor }: FooterProps) {
  return (
    <footer className="hidden lg:block bg-slate-950 text-slate-400 border-t border-slate-800/60">

      {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand column — 4 cols */}
          <div className="md:col-span-4">
            <img
              src={image_vh_logo}
              alt="VisvasaHome"
              className="h-9 w-auto mb-5"
              style={{ filter: 'brightness(0) invert(1)' }}
            />

            <p className="text-[13px] leading-relaxed text-slate-400 mb-6 max-w-xs">
              India's trusted platform connecting homes and businesses with verified local service professionals — from repairs to full renovation.
            </p>

            {/* Contact info */}
            <ul className="space-y-2.5 text-[13px] mb-6">
              <li>
                <a
                  href="tel:+919057567160"
                  className="flex items-center gap-2.5 text-slate-400 hover:text-blue-400 transition-colors duration-200 w-fit"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  +91 905 756 7160
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@visvasahome.com"
                  className="flex items-center gap-2.5 text-slate-400 hover:text-blue-400 transition-colors duration-200 w-fit"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  contact@visvasahome.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-500 text-[12px]">
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                Jaipur, Rajasthan, India — Est. 2022
              </li>
            </ul>

            {/* Grievance officer */}
            <div className="bg-slate-900 rounded-2xl px-4 py-3.5 mb-6 border border-slate-800/80">
              <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-1">Grievance Officer</p>
              <p className="text-[12px] text-slate-300 font-semibold">Kunal Mittal</p>
              <p className="text-[11px] text-slate-500">grievance@visvasahome.com</p>
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5 ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns — 8 cols, 3 sub-cols */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* For Customers */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400 mb-5">
                For Customers
              </h4>
              <ul className="space-y-3">
                {NAV_CUSTOMER.map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => onNavigate(item.page)}
                      className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150 text-left flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-150 inline-block">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Professionals */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400 mb-5">
                For Professionals
              </h4>
              <ul className="space-y-3">
                {NAV_PROFESSIONAL.map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={item.page === 'professional-register'
                        ? (onRegisterContractor || (() => onNavigate(item.page)))
                        : () => onNavigate(item.page)
                      }
                      className={`text-[13px] transition-colors duration-150 text-left flex items-center gap-1.5 group ${item.highlight
                          ? 'text-white font-extrabold hover:text-blue-300'
                          : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      {item.highlight && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      )}
                      <span className="group-hover:translate-x-1 transition-transform duration-150 inline-block">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400 mb-5">
                Company
              </h4>
              <ul className="space-y-3">
                {NAV_COMPANY.map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => onNavigate(item.page)}
                      className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150 text-left group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-150 inline-block">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── SERVICES QUICK-LINKS ───────────────────────────────────────── */}
        <div className="border-t border-slate-800/60 mt-12 pt-8">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-4">
            Popular Services
          </p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s.page}
                onClick={() => onNavigate(s.page)}
                className="text-[11px] font-semibold text-slate-500 hover:text-blue-400 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 rounded-full px-3 py-1.5 transition-all duration-200"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[12px] text-slate-600 text-center sm:text-left">
            <span>© 2026 VisvasaHome (Visvasa Pvt. Ltd.). All rights reserved.</span>
            <span className="mx-2 hidden sm:inline">·</span>
            <span className="block sm:inline text-slate-700 mt-0.5 sm:mt-0">Reliable · Transparent · Local-First · Quality-Driven</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center text-[12px]">
            {[
              { label: 'Privacy Policy', page: 'privacy-policy' },
              { label: 'Terms of Service', page: 'terms' },
              { label: 'Refund Policy', page: 'refund-policy' },
            ].map((item, i, arr) => (
              <span key={item.page} className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate(item.page)}
                  className="text-slate-600 hover:text-blue-400 transition-colors duration-200"
                >
                  {item.label}
                </button>
                {i < arr.length - 1 && <span className="text-slate-800">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}