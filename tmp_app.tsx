import { Header } from '@shared/components/Header';
import { Hero } from '@shared/components/Hero';
import { HomeCategories } from '@catalog/components/HomeCategories';
import { ServicesOffered } from '@catalog/components/ServicesOffered';
import { Differentiation } from '@shared/components/Differentiation';
import { TestimonialsSection } from '@shared/components/TestimonialsSection';
import { ForContractors } from '@professional/components/ForContractors';
import { CTASection } from '@shared/components/CTASection';
import { Footer } from '@shared/components/Footer';
import { RegisterContractor } from '@professional/components/RegisterContractor';
import { GetStartedCustomer } from '@customer/components/GetStartedCustomer';
import { JoinProfessional } from '@professional/components/JoinProfessional';
import { BenefitsPage } from '@marketing/components/BenefitsPage';
import { TrainingSupport } from '@professional/components/TrainingSupport';
import { SuccessStories } from '@shared/components/SuccessStories';
import { AMCOffice } from '@amc/components/AMCOffice';
import { AMCHome } from '@amc/components/AMCHome';
import { AMCCommercial } from '@amc/components/AMCCommercial';
import { AMCIndustrial } from '@amc/components/AMCIndustrial';
import { AMCHealthcare } from '@amc/components/AMCHealthcare';
import { AMCEducational } from '@amc/components/AMCEducational';
import { AMCHospitality } from '@amc/components/AMCHospitality';
import { AMCSociety } from '@amc/components/AMCSociety';
import { AboutUsPage } from '@marketing/components/AboutUsPage';
import { OurMissionPage } from '@marketing/components/OurMissionPage';
import { ContactPage } from '@marketing/components/ContactPage';
import { TestimonialsPage } from '@marketing/components/TestimonialsPage';
import { BlogPage } from '@marketing/components/BlogPage';
import { HowItWorksPage } from '@marketing/components/HowItWorksPage';
import { FAQPage } from '@marketing/components/FAQPage';
import { PrivacyPolicyPage } from '@marketing/components/PrivacyPolicyPage';
import { TermsPage } from '@marketing/components/TermsPage';
import { CareersPage } from '@marketing/components/CareersPage';
import { SEO } from '@shared/components/SEO';
import { ProfessionalRegisterPage } from '@professional/components/ProfessionalRegisterPage';
import { AuthPage } from '@auth/components/AuthPage';
import { MobileBottomNav } from '@shared/components/MobileBottomNav';
import { UserProfilePage } from '@customer/components/UserProfilePage';
import { WhatsAppFloatingButton } from '@shared/components/WhatsAppFloatingButton';
import { MobileContactBar } from '@shared/components/MobileContactBar';
import { BookingService } from '@booking/services/bookingService';
import { FloatingFeedbackButton } from '@shared/components/FloatingFeedbackButton';
import { MobileTopBar } from '@shared/components/MobileTopBar';
import { BookingsPage } from '@booking/components/BookingsPage';
import { MenuPage } from '@shared/components/MenuPage';
import { EditProfilePage } from '@customer/components/EditProfilePage';
import { ManageAddressesPage } from '@customer/components/ManageAddressesPage';
import { NotificationsPage } from '@customer/components/NotificationsPage';
import { SavedServicesPage } from '@customer/components/SavedServicesPage';
import { AppSettingsPage } from '@customer/components/AppSettingsPage';
import { HelpSupportPage } from '@customer/components/HelpSupportPage';
import { CompetitiveAnalysisPage } from '@admin/components/CompetitiveAnalysisPage';
import { PlumbingServicesPage } from '@catalog/components/PlumbingServicesPage';
import { ElectricalServicesPage } from '@catalog/components/ElectricalServicesPage';
import { ACServicesPage } from '@catalog/components/ACServicesPage';
import { CleaningServicesPage } from '@catalog/components/CleaningServicesPage';
import { ApplianceRepairPage } from '@catalog/components/ApplianceRepairPage';
import { PestControlPage } from '@catalog/components/PestControlPage';
import { PaintingServicesPage } from '@catalog/components/PaintingServicesPage';
import { CarpentryServicesPage } from '@catalog/components/CarpentryServicesPage';
import { InteriorDesignPage } from '@catalog/components/InteriorDesignPage';
import { LandscapingServicesPage } from '@catalog/components/LandscapingServicesPage';
import { FlooringServicesPage } from '@catalog/components/FlooringServicesPage';
import { MasonryServicesPage } from '@catalog/components/MasonryServicesPage';
import { RoofingServicesPage } from '@catalog/components/RoofingServicesPage';
import { GeneralRepairPage } from '@catalog/components/GeneralRepairPage';
import { ExcavationServicesPage } from '@catalog/components/ExcavationServicesPage';
import { CareServicesPage } from '@catalog/components/CareServicesPage';
import { EventServicesPage } from '@catalog/components/EventServicesPage';
import { ConstructionServicesPage } from '@marketing/components/ConstructionServicesPage';
import { ProfessionalDashboard } from '@professional/components/ProfessionalDashboard';
import { AdminLoginPage } from '@auth/components/AdminLoginPage';
import { DemoSandboxPanel } from '@admin/components/DemoSandboxPanel';
import { AdminDashboard } from '@admin/components/AdminDashboard';
import { AdminBookingsPage } from '@admin/components/AdminBookingsPage';
import { AdminProfessionalsPage } from '@admin/components/AdminProfessionalsPage';
import { AdminCustomersPage } from '@admin/components/AdminCustomersPage';
import { AdminServicesPage } from '@admin/components/AdminServicesPage';
import { AdminReportsPage } from '@admin/components/AdminReportsPage';
import { ForgotPasswordPage } from '@auth/components/ForgotPasswordPage';
import { ResetPasswordPage } from '@auth/components/ResetPasswordPage';
import { EmailSignupPage } from '@auth/components/EmailSignupPage';
import { VerifyEmailPage } from '@auth/components/VerifyEmailPage';
import { OAuthCallbackPage } from '@auth/components/OAuthCallbackPage';
import { CookieConsent } from '@shared/components/CookieConsent';
import { SubscriptionManagementPage } from '@amc/components/SubscriptionManagementPage';
import { RefundPolicyPage } from '@marketing/components/RefundPolicyPage';
import { ServicesPricingPage } from '@catalog/components/ServicesPricingPage';
import { PaymentTestingPage } from '@payment/components/PaymentTestingPage';
import { ContractorHubPage } from '@professional/components/ContractorHubPage';
import { ContractorProjectPage } from '@professional/components/ContractorProjectPage';
import { ContractorDirectoryPage } from '@professional/components/ContractorDirectoryPage';
import { BookingFlowPage } from '@booking/components/BookingFlowPage';
import { WalletPage } from '@payment/components/WalletPage';
import { LiveTrackingPage } from '@booking/components/LiveTrackingPage';
import { SPJobsPage } from '@professional/components/SPJobsPage';
import { SPJobDetailPage } from '@professional/components/SPJobDetailPage';
import { SPEarningsPage } from '@professional/components/SPEarningsPage';
import { SPSchedulePage } from '@professional/components/SPSchedulePage';
import { SPTrainingHubPage } from '@professional/components/SPTrainingHubPage';
import { AMCPackagesPage } from '@amc/components/AMCPackagesPage';
import { AMCManagementDashboard } from '@amc/components/AMCManagementDashboard';
import { AMCBookingPage } from '@amc/components/AMCBookingPage';
import { LoyaltyDashboardPage } from '@customer/components/LoyaltyDashboardPage';
import { SubmitReviewPage } from '@booking/components/SubmitReviewPage';
import { ChatPage } from '@customer/components/ChatPage';
import { ToastProvider, useToast } from '@shared/components/ToastContext';
import { SearchPage } from '@catalog/components/SearchPage';
import { ContractorQuoteComparisonPage } from '@professional/components/ContractorQuoteComparisonPage';
import { InvestorRelationsPage } from '@marketing/components/InvestorRelationsPage';
import { PartnerHomePage } from '@professional/components/PartnerHomePage';
import { PartnerAboutPage } from '@professional/components/PartnerAboutPage';
import { PartnerTermsPage } from '@professional/components/PartnerTermsPage';
import { PartnerPrivacyPage } from '@professional/components/PartnerPrivacyPage';
import { PartnerAntiDiscriminationPage } from '@professional/components/PartnerAntiDiscriminationPage';
import { PartnerInfoSecurityPage } from '@professional/components/PartnerInfoSecurityPage';
import { PartnerWelfarePage } from '@professional/components/PartnerWelfarePage';
import { PartnerCityPage } from '@professional/components/PartnerCityPage';
import { HomeSecurityPage } from '@marketing/components/HomeSecurityPage';
import { WaterPurifierChimneyPage } from '@marketing/components/WaterPurifierChimneyPage';
import { HomeImprovementPage } from '@marketing/components/HomeImprovementPage';
import { GreenEnergyPage } from '@marketing/components/GreenEnergyPage';
import { CarCleaningPage } from '@marketing/components/CarCleaningPage';
import { MoversPackersPage } from '@marketing/components/MoversPackersPage';
import { EducationPage } from '@marketing/components/EducationPage';
import { PetCarePage } from '@marketing/components/PetCarePage';
import { BeautyServicesPage } from '@catalog/components/BeautyServicesPage';
import { WellnessServicesPage } from '@catalog/components/WellnessServicesPage';
import { InteractiveTour } from '@shared/components/InteractiveTour';
import { DiscoverySection } from '@catalog/components/DiscoverySection';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { organizationSchema, localBusinessSchema, serviceSchema, websiteSchema } from '@utils/structuredData';
import {
  trackPageView,
  trackAuthEvent,
  trackServiceCTAClick,
  trackBookingFunnel,
  trackAMCInterest,
  trackCTAClick,
  trackProfessionalRegistration,
  isAnalyticsEnabled,
} from '@core/analytics/analytics';
import { CartManager } from '@booking/services/cartManager';
import { isSessionValid, updateSessionActivity, generateDeviceFingerprint } from '@auth/services/security';

type PageType =
  | 'home'
  | 'register-contractor'
  | 'get-started-customer'
  | 'join-professional'
  | 'professional-register'
  | 'benefits'
  | 'training-support'
  | 'success-stories'
  | 'amc-office'
  | 'amc-home'
  | 'amc-commercial'
  | 'amc-industrial'
  | 'amc-healthcare'
  | 'amc-educational'
  | 'amc-hospitality'
  | 'amc-society'
  | 'about-us'
  | 'our-mission'
  | 'contact'
  | 'testimonials'
  | 'blog'
  | 'careers'
  | 'how-it-works'
  | 'faq'
  | 'privacy-policy'
  | 'terms'
  | 'login'
  | 'profile'
  | 'search'
  | 'bookings'
  | 'menu'
  | 'edit-profile'
  | 'addresses'
  | 'notifications'
  | 'saved'
  | 'settings'
  | 'help'
  | 'competitive-analysis'
  | 'plumbing-services'
  | 'electrical-services'
  | 'ac-services'
  | 'cleaning-services'
  | 'appliance-repair'
  | 'pest-control'
  | 'painting-services'
  | 'carpentry-services'
  | 'interior-design'
  | 'landscaping-services'
  | 'flooring-services'
  | 'masonry-services'
  | 'roofing-services'
  | 'general-repair'
  | 'excavation-services'
  | 'care-services'
  | 'event-services'
  | 'construction-services'
  | 'home-security'
  | 'water-purifier-chimney'
  | 'home-improvement'
  | 'green-energy'
  | 'car-cleaning'
  | 'movers-packers'
  | 'education-services'
  | 'pet-care'
  | 'beauty-services'
  | 'wellness-services'
  | 'professional-dashboard'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-bookings'
  | 'admin-professionals'
  | 'admin-customers'
  | 'admin-services'
  | 'admin-reports'
  | 'admin-payments'
  | 'admin-reviews'
  | 'admin-notifications'
  | 'admin-settings'
  | 'admin-messages'
  | 'forgot-password'
  | 'reset-password'
  | 'email-signup'
  | 'verify-email'
  | 'auth-callback'
  | 'subscription-management'
  | 'payment-testing'
  | 'contractor-hub'
  | 'contractor-project'
  | 'contractor-directory'
  | 'booking-flow'
  | 'wallet'
  | 'live-tracking'
  | 'sp-jobs'
  | 'sp-job-detail'
  | 'sp-earnings'
  | 'sp-schedule'
  | 'sp-training'
  | 'amc-packages'
  | 'amc-purchase'
  | 'amc-booking'
  | 'amc-dashboard'
  | 'amc-visit-history'
  | 'contractor-quote-comparison'
  | 'contractor-project-detail'
  | 'contractor-dashboard'
  | 'chat-list' | 'chat' | 'bug-report' | 'milestones' | 'loyalty-dashboard'
  | 'submit-review'
  | 'investor-relations'
  | 'partner-home'
  | 'partner-about'
  | 'partner-terms'
  | 'partner-privacy'
  | 'partner-anti-discrimination'
  | 'partner-info-security'
  | 'partner-welfare'
  | 'partner-login'
  | 'partner-faq'
  | 'partner-city-jaipur'
  | 'partner-city-delhi'
  | 'partner-city-mumbai'
  | 'partner-city-bangalore'
  | 'partner-city-pune'
  | 'partner-city-hyderabad'
  | 'partner-city-chennai'
  | 'partner-city-ahmedabad'
  | 'refund-policy'
  | 'services-pricing';

const seoMeta: Record<string, { title: string; description: string }> = {
  'home': {
    title: 'VisvasaHome ΓÇö Trusted Local Services | Verified Professionals Across India',
    description: 'Book verified local professionals for home repair, plumbing, electrical, cleaning, painting, AC service, appliance repair, interior design, and more. VisvasaHome is India\'s trusted local services ecosystem with 10,000+ completed services in 20+ cities.',
  },
  'register-contractor': {
    title: 'Register as Contractor | Join VisvasaHome Professional Network',
    description: 'Join VisvasaHome\'s verified contractor network. Grow your business with verified customer leads, professional support, and fair earnings. Register today.',
  },
  'get-started-customer': {
    title: 'Book a Service | VisvasaHome ΓÇö Verified Local Professionals',
    description: 'Book verified local professionals for home repair, maintenance, cleaning, appliance repair, painting, carpentry, and more. Transparent pricing, service warranty included.',
  },
  'join-professional': {
    title: 'Join as Professional | VisvasaHome Contractor Program',
    description: 'Become a verified professional on VisvasaHome. Access consistent work, training, support, and career-building opportunities across 20+ cities.',
  },
  'professional-register': {
    title: 'Register as Professional | Earn Γé╣30,000ΓÇôΓé╣90,000/Month | VisvasaHome Partner Program',
    description: 'Join VisvasaHome as a verified professional partner. Register FREE as electrician, plumber, AC technician, carpenter, cleaner, painter, or home repair specialist. Earn Γé╣30,000ΓÇôΓé╣90,000/month with AMC income, fair pricing, free training, and verified badge. India\'s most trusted local services professional network.',
  },
  'benefits': {
    title: 'Contractor Benefits | VisvasaHome Professional Network',
    description: 'Discover the benefits of joining VisvasaHome. Regular work, fair pay, training resources, and a supportive professional community.',
  },
  'training-support': {
    title: 'Training & Support | VisvasaHome Professionals',
    description: 'Professional development programs, quality training, and ongoing support for VisvasaHome contractors. Build your skills and grow your career.',
  },
  'success-stories': {
    title: 'Success Stories | VisvasaHome Contractors',
    description: 'Real stories from contractors who have built successful careers through the VisvasaHome platform.',
  },
  'amc-office': {
    title: 'Office AMC Services | Annual Maintenance Contract for Offices',
    description: 'Comprehensive Annual Maintenance Contracts for office spaces. Scheduled maintenance, priority support, and transparent pricing from VisvasaHome.',
  },
  'amc-home': {
    title: 'Home AMC Plans | Annual Home Maintenance Contract India',
    description: 'Annual Maintenance Contracts for homes in India. Complete home maintenance with priority service and transparent pricing. Plans for 1BHK to villas.',
  },
  'amc-commercial': {
    title: 'Commercial AMC Services | Business Maintenance Contracts',
    description: 'Annual Maintenance Contracts for commercial properties. Reliable maintenance for retail stores, showrooms, and commercial establishments.',
  },
  'amc-industrial': {
    title: 'Industrial AMC Services | Factory & Warehouse Maintenance',
    description: 'Specialized Annual Maintenance Contracts for industrial facilities. Expert maintenance for manufacturing plants, warehouses, and industrial properties.',
  },
  'amc-healthcare': {
    title: 'Healthcare AMC Services | Hospital & Clinic Maintenance',
    description: 'Compliant Annual Maintenance Contracts for healthcare facilities. Specialized maintenance for hospitals, clinics, and medical centers.',
  },
  'amc-educational': {
    title: 'Educational AMC Services | School & College Maintenance',
    description: 'Comprehensive Annual Maintenance Contracts for educational institutions. Complete campus maintenance for schools, colleges, and universities.',
  },
  'amc-hospitality': {
    title: 'Hospitality AMC Services | Hotel & Resort Maintenance',
    description: 'Premium Annual Maintenance Contracts for hotels, resorts, and hospitality properties. Guest-experience focused maintenance solutions.',
  },
  'amc-society': {
    title: 'Society AMC Services | Residential Society Maintenance',
    description: 'Annual Maintenance Contracts for residential societies and apartment complexes. Complete common area and building maintenance.',
  },
  'about-us': {
    title: 'About VisvasaHome | Jaipur, India',
    description: 'Learn about VisvasaHome ΓÇö India\'s trusted local services ecosystem. Our story, values, team, and commitment to trust-driven services.',
  },
  'our-mission': {
    title: 'Our Mission | VisvasaHome ΓÇö Trust, Delivered Locally',
    description: 'VisvasaHome\'s mission is to make local services organized, accountable, and dependable. Building trust between communities and verified local professionals.',
  },
  'contact': {
    title: 'Contact Us | VisvasaHome ΓÇö Get in Touch',
    description: 'Contact VisvasaHome for service bookings, AMC enquiries, contractor registration, or any questions. Call, WhatsApp, or email ΓÇö we respond within 4 hours.',
  },
  'testimonials': {
    title: 'Customer Reviews | VisvasaHome ΓÇö Real Experiences',
    description: 'Read verified customer reviews and testimonials for VisvasaHome services across India. 4.8/5 rating from 10,000+ completed services.',
  },
  'blog': {
    title: 'Home Maintenance Tips & Guides | VisvasaHome Blog',
    description: 'Expert home maintenance tips, guides, and seasonal checklists from VisvasaHome. Learn about plumbing, electrical safety, cleaning, pest control, and more.',
  },
  'careers': {
    title: 'Careers at VisvasaHome | Join Our Team',
    description: 'Join VisvasaHome\'s mission to transform local services across India. Explore open positions in engineering, design, product, operations, and more.',
  },
  'how-it-works': {
    title: 'How It Works | VisvasaHome Service Process',
    description: 'See how VisvasaHome connects you with verified professionals. Simple 5-step booking process with transparency, accountability, and service warranty.',
  },
  'faq': {
    title: 'FAQ | Frequently Asked Questions | VisvasaHome',
    description: 'Answers to the most common questions about VisvasaHome services, AMC plans, contractor registration, pricing, and the booking process.',
  },
  'privacy-policy': {
    title: 'Privacy Policy | VisvasaHome',
    description: 'VisvasaHome\'s privacy policy. How we collect, use, and protect your personal information on our local services platform.',
  },
  'terms': {
    title: 'Terms of Service | VisvasaHome',
    description: 'Terms and conditions governing the use of VisvasaHome\'s platform, services, and professional network.',
  },
  'login': {
    title: 'Login | VisvasaHome',
    description: 'Login to your VisvasaHome account to manage bookings and access services.',
  },
  'profile': {
    title: 'My Profile | VisvasaHome',
    description: 'Manage your VisvasaHome account, bookings, and preferences.',
  },
  'search': {
    title: 'Browse Services | VisvasaHome',
    description: 'Browse all available services on VisvasaHome.',
  },
  'bookings': {
    title: 'My Bookings | VisvasaHome',
    description: 'View and manage your service bookings.',
  },
  'menu': {
    title: 'Menu | VisvasaHome',
    description: 'Explore VisvasaHome services and features.',
  },
  'edit-profile': {
    title: 'Edit Profile | VisvasaHome',
    description: 'Update your VisvasaHome profile information.',
  },
  'addresses': {
    title: 'Manage Addresses | VisvasaHome',
    description: 'Add and manage your saved service addresses.',
  },
  'notifications': {
    title: 'Notifications | VisvasaHome',
    description: 'Manage your notification preferences.',
  },
  'saved': {
    title: 'Saved Services | VisvasaHome',
    description: 'Your saved and favourite services on VisvasaHome.',
  },
  'settings': {
    title: 'App Settings | VisvasaHome',
    description: 'Manage app settings, language, and preferences.',
  },
  'help': {
    title: 'Help & Support | VisvasaHome',
    description: 'Get help, contact support, and read FAQs.',
  },
  'competitive-analysis': {
    title: 'Competitive Analysis | VisvasaHome vs Urban Company, Housejoy & Pronto',
    description: 'See how VisvasaHome compares with Urban Company, Housejoy, and Pronto. Comprehensive feature comparison, market analysis, and our unique 8 AMC segment advantage.',
  },
  'plumbing-services': {
    title: 'Professional Plumbing Services | Verified Plumbers | VisvasaHome',
    description: 'Book expert plumbers for tap repair, leak fixing, pipe fitting, geyser installation, drainage work & more. 30-min arrival, verified professionals, service warranty. Starting Γé╣299. Emergency plumbing available 24/7.',
  },
  'electrical-services': {
    title: 'Licensed Electricians | Electrical Services | VisvasaHome',
    description: 'Book certified electricians for wiring, switch repair, fan installation, inverter setup & more. Licensed professionals, same-day service, 90-day warranty. Starting Γé╣199. 24/7 emergency electrical service available.',
  },
  'ac-services': {
    title: 'AC Service & Repair | AC Installation | VisvasaHome',
    description: 'Professional AC service, repair, installation & gas charging. Certified technicians for all AC brands. 90-day warranty on gas filling. Starting Γé╣349. Same-day service available.',
  },
  'cleaning-services': {
    title: 'Home Cleaning Services | Deep Cleaning | VisvasaHome',
    description: 'Book professional cleaning services - home cleaning, deep cleaning, kitchen, bathroom, sofa, carpet & more. Eco-friendly products, background-verified cleaners. Starting Γé╣799. 7-day satisfaction guarantee.',
  },
  'appliance-repair': {
    title: 'Appliance Repair Services | Refrigerator, Washing Machine Repair | VisvasaHome',
    description: 'Expert appliance repair for refrigerator, washing machine, microwave, TV, dishwasher & more. 30-day warranty on all repairs. Starting Γé╣399. Same-day service available across India.',
  },
  'pest-control': {
    title: 'Pest Control Services | Cockroach, Termite, Bedbug Control | VisvasaHome',
    description: 'Safe, eco-friendly pest control for cockroach, termite, bedbug, rodent & more. Licensed technicians, up to 90-day warranty. Starting Γé╣799. Get pest-free home today.',
  },
  'painting-services': {
    title: 'Professional Painting Services | Interior & Exterior Painting | VisvasaHome',
    description: 'Expert painting contractors for interior, exterior & texture painting. Premium brands, skilled painters, 1-year warranty. Starting Γé╣3,999. Free color consultation included.',
  },
  'carpentry-services': {
    title: 'Carpentry Services | Furniture Assembly | Wardrobe Installation | VisvasaHome',
    description: 'Skilled carpenters for furniture assembly, wardrobe, kitchen cabinets, door frames & custom woodwork. Quality craftsmanship guaranteed. Starting Γé╣499.',
  },
  'interior-design': {
    title: 'Interior Design Services | Modular Kitchen | Home Interiors | VisvasaHome',
    description: 'Transform your home with expert interior designers. Modular kitchen, wardrobes, full home interiors, 3D design. Premium materials, professional execution. Starting Γé╣4,999.',
  },
  'landscaping-services': {
    title: 'Landscaping Services | Garden Design | Lawn Maintenance | VisvasaHome',
    description: 'Expert landscaping services - garden design, lawn maintenance, tree planting & outdoor specialists. Transform your outdoor space. Starting Γé╣799.',
  },
  'flooring-services': {
    title: 'Flooring Services | Tile, Marble, Wooden Flooring | VisvasaHome',
    description: 'Professional flooring contractors for tile, marble, wooden flooring installation & polishing. Premium finish guaranteed. Starting Γé╣29/sqft.',
  },
  'masonry-services': {
    title: 'Masonry Services | Brick Work | Tiling | Plastering | VisvasaHome',
    description: 'Expert masonry contractors for brick work, tiling, plastering, concrete work. Foundation experts, quality construction. Get quote today.',
  },
  'roofing-services': {
    title: 'Roofing Services | Roof Repair | Waterproofing | VisvasaHome',
    description: 'Professional roofing contractors for roof installation, repair, waterproofing. Weather protection guaranteed. Starting Γé╣2,999.',
  },
  'general-repair': {
    title: 'General Repair & Maintenance | Handyman Services | VisvasaHome',
    description: 'Quick handyman services for door repair, lock installation, wall mounting & general home repairs. Fast, reliable service. Starting Γé╣299.',
  },
  'excavation-services': {
    title: 'Excavation Services | Site Preparation | Foundation Work | VisvasaHome',
    description: 'Professional excavation contractors for site preparation, foundation work, land grading. Heavy equipment available. Contact for quote.',
  },
  'care-services': {
    title: 'Care Services | Baby Care | Elderly Care | Patient Care | VisvasaHome',
    description: 'Professional care services - baby care, nanny, elderly care assistance, patient care. Background-verified caregivers. Starting Γé╣999/day.',
  },
  'event-services': {
    title: 'Event Services | Wedding Decoration | Birthday Party Setup | VisvasaHome',
    description: 'Professional event services - wedding decoration, birthday party setup, festival decoration. Make your events memorable. Starting Γé╣2,999.',
  },
  'construction-services': {
    title: 'Construction Services | Licensed Contractors | Building Services | VisvasaHome',
    description: 'Complete construction ecosystem - plumbing, electrical, masonry, painting, roofing & more. 500+ verified contractors for residential & commercial projects. Licensed, insured, quality guaranteed.',
  },
  'home-security': {
    title: 'CCTV, Smart Lock & Inverter Installation | Home Security Services | VisvasaHome',
    description: 'Professional CCTV installation, smart lock setup, inverter/UPS installation and repair. Certified technicians, same-day service, 90-day warranty.',
  },
  'water-purifier-chimney': {
    title: 'RO Water Purifier & Chimney Service | VisvasaHome',
    description: 'RO water purifier installation, filter change, chimney deep cleaning and repair. Certified technicians, 30-day warranty on all services.',
  },
  'home-improvement': {
    title: 'Curtains, Wallpaper, Grills & Home Improvement Services | VisvasaHome',
    description: 'Curtain installation, wallpaper fitting, mosquito nets, grill fabrication, aluminium door/window work. Professional installation with warranty.',
  },
  'green-energy': {
    title: 'Solar Panel Installation & EV Charger Setup | VisvasaHome',
    description: 'Residential solar panel installation, EV home charger setup, solar maintenance. Certified installers, long-term warranty, net metering support.',
  },
  'car-cleaning': {
    title: 'Car Wash & Detailing at Home | VisvasaHome',
    description: 'Professional car washing and detailing at your doorstep. Basic wash, interior cleaning, ceramic coating, monthly subscription plans available.',
  },
  'professional-dashboard': {
    title: 'Professional Dashboard | VisvasaHome',
    description: 'Manage your jobs, earnings, and profile as a VisvasaHome professional contractor.',
  },
  'admin-login': {
    title: 'Admin Login | VisvasaHome Administration',
    description: 'Secure login for VisvasaHome administrators.',
  },
  'admin-dashboard': {
    title: 'Admin Dashboard | VisvasaHome',
    description: 'VisvasaHome admin panel - manage bookings, professionals, customers, and analytics.',
  },
  'admin-bookings': {
    title: 'Manage Bookings | Admin Panel | VisvasaHome',
    description: 'View and manage all service bookings - update status, assign professionals.',
  },
  'admin-professionals': {
    title: 'Manage Professionals | Admin Panel | VisvasaHome',
    description: 'Verify, approve, and manage all registered professionals and contractors.',
  },
  'admin-customers': {
    title: 'Manage Customers | Admin Panel | VisvasaHome',
    description: 'View customer data, booking history, and customer insights.',
  },
  'admin-services': {
    title: 'Manage Services | Admin Panel | VisvasaHome',
    description: 'Add, edit, and manage service catalog and pricing.',
  },
  'admin-reports': {
    title: 'Reports & Analytics | Admin Panel | VisvasaHome',
    description: 'Revenue reports, booking analytics, and business insights.',
  },
  'forgot-password': {
    title: 'Forgot Password | VisvasaHome',
    description: 'Reset your VisvasaHome account password.',
  },
  'reset-password': {
    title: 'Reset Password | VisvasaHome',
    description: 'Create a new password for your VisvasaHome account.',
  },
  'email-signup': {
    title: 'Sign Up | VisvasaHome',
    description: 'Create your VisvasaHome account with email.',
  },
  'verify-email': {
    title: 'Verify Email | VisvasaHome',
    description: 'Verify your email address to activate your account.',
  },
  'auth-callback': {
    title: 'Authentication | VisvasaHome',
    description: 'Completing authentication process.',
  },
  'subscription-management': {
    title: 'Manage Subscription | VisvasaHome',
    description: 'Manage your AMC subscription - upgrade, downgrade, or cancel.',
  },
  'payment-testing': {
    title: 'Payment Testing | VisvasaHome',
    description: 'Test payment flows including success, failure, and refund scenarios.',
  },
  'contractor-hub': {
    title: 'Contractor Hub | Large Projects & Renovation | VisvasaHome',
    description: 'Post your renovation, construction, or interior design project. Get multiple verified quotes. Escrow-protected milestone payments.',
  },
  'booking-flow': {
    title: 'Book a Service | VisvasaHome',
    description: 'Book verified professionals with slot selection, OTP verification, and escrow-protected payment.',
  },
  'wallet': {
    title: 'My Wallet | VisvasaHome',
    description: 'Manage your VisvasaHome wallet balance, add money, track transactions, and refer & earn rewards.',
  },
  'live-tracking': {
    title: 'Live Tracking | VisvasaHome',
    description: 'Track your service professional in real time. View ETA, chat, and verify job start with OTP.',
  },
  'investor-relations': {
    title: 'Investor Relations | VisvasaHome (Visvasa Pvt. Ltd.)',
    description: 'Investor information, financial results, board of directors, governance, ESG reports, and corporate announcements for VisvasaHome.',
  },
  'partner-home': {
    title: 'Partner with VisvasaHome | Earn Γé╣30,000-Γé╣90,000/Month as Service Professional',
    description: 'Join 50,000+ verified service professionals. Free registration, weekly payouts, flexible hours, training, and insurance. Partner with India\'s most trusted home services platform.',
  },
  'partner-about': {
    title: 'About Partner Program | VisvasaHome',
    description: 'Learn about VisvasaHome\'s mission to empower service professionals. 50,000+ partners, Γé╣225Cr+ earnings distributed. Join our community today.',
  },
  'partner-terms': {
    title: 'Partner Terms & Conditions | VisvasaHome',
    description: 'Terms and conditions for service professional partners on VisvasaHome platform. Understand your rights, responsibilities, and benefits.',
  },
  'partner-privacy': {
    title: 'Partner Privacy Policy | VisvasaHome',
    description: 'Privacy policy for VisvasaHome service professional partners. Learn how we protect your personal information and data.',
  },
  'partner-anti-discrimination': {
    title: 'Anti-Discrimination Policy | VisvasaHome Partners',
    description: 'VisvasaHome\'s commitment to equal opportunity and zero tolerance for discrimination. Creating an inclusive platform for all partners.',
  },
  'partner-info-security': {
    title: 'Information Security Policy | VisvasaHome Partners',
    description: 'Security guidelines and best practices for VisvasaHome partners. Protecting your data and customer information.',
  },
  'partner-welfare': {
    title: 'Partner Welfare Policy | VisvasaHome',
    description: 'Comprehensive welfare benefits for VisvasaHome partners including health insurance, training, financial support, and community programs.',
  },
  'partner-login': {
    title: 'Partner Login | VisvasaHome',
    description: 'Login to VisvasaHome Partner Portal to manage jobs, earnings, and profile.',
  },
  'partner-faq': {
    title: 'Partner FAQ | VisvasaHome',
    description: 'Frequently asked questions for VisvasaHome service professional partners.',
  },
  'partner-city-jaipur': {
    title: 'Partner with VisvasaHome in Jaipur | 3,200+ Active Partners',
    description: 'Join 3,200+ service professionals earning Γé╣42,000/month average in Jaipur. 2,500+ monthly jobs available. Register free.',
  },
  'partner-city-delhi': {
    title: 'Partner with VisvasaHome in Delhi NCR | 12,000+ Active Partners',
    description: 'Join 12,000+ service professionals earning Γé╣52,000/month average in Delhi NCR. 8,500+ monthly jobs. Premium market opportunities.',
  },
  'partner-city-mumbai': {
    title: 'Partner with VisvasaHome in Mumbai | 15,000+ Active Partners',
    description: 'Join 15,000+ service professionals earning Γé╣58,000/month average in Mumbai. Highest earning potential in India. Register now.',
  },
  'partner-city-bangalore': {
    title: 'Partner with VisvasaHome in Bangalore | 10,500+ Active Partners',
    description: 'Join 10,500+ service professionals earning Γé╣51,000/month average in Bangalore. Tech-savvy customers, consistent demand.',
  },
  'partner-city-pune': {
    title: 'Partner with VisvasaHome in Pune | 5,500+ Active Partners',
    description: 'Join 5,500+ service professionals earning Γé╣46,000/month average in Pune. Growing IT hub with 4,500+ monthly jobs.',
  },
  'partner-city-hyderabad': {
    title: 'Partner with VisvasaHome in Hyderabad | 7,000+ Active Partners',
    description: 'Join 7,000+ service professionals earning Γé╣48,000/month average in Hyderabad. 5,500+ monthly jobs in growing tech city.',
  },
  'partner-city-chennai': {
    title: 'Partner with VisvasaHome in Chennai | Service Professional Jobs',
    description: 'Join VisvasaHome\'s partner network in Chennai. Earn competitive income as verified service professional.',
  },
  'partner-city-ahmedabad': {
    title: 'Partner with VisvasaHome in Ahmedabad | Service Professional Jobs',
    description: 'Join VisvasaHome\'s partner network in Ahmedabad. Earn competitive income as verified service professional.',
  },
  'refund-policy': {
    title: 'Cancellation, Refund & Shipping Policy | Visvasahome Private Limited',
    description: 'VisvasaHome cancellation, refund, shipping and payment gateway policy. Free cancellation up to 2 hours before service. Refund to original payment method within 5ΓÇô7 business days.',
  },
  'services-pricing': {
    title: 'Services & Pricing | VisvasaHome ΓÇö All Plans in INR',
    description: 'Browse all home services, AMC plans, and construction services with transparent INR pricing. No hidden charges. 150+ services across plumbing, electrical, AC, cleaning, painting, renovation and more.',
  },
  'movers-packers': {
    title: 'Movers & Packers | Reliable Relocation Services | VisvasaHome',
    description: 'Book verified movers and packers for local shifting, inter-city moving, furniture assembly, loading, and unloading. Damage cover included, transparent pricing.',
  },
  'education-services': {
    title: 'Education & Tutors | At-Home Private Lessons | VisvasaHome',
    description: 'Book verified private tutors for school subjects, music lessons (guitar/keyboard), spoken languages, and arts workshops at home.',
  },
  'pet-care': {
    title: 'Pet Care Services | Professional Pet Groomers & Walkers | VisvasaHome',
    description: 'At-home dog grooming, dog walking packages with GPS tracking, vet-at-home consultations, and cage-free home pet boarding.',
  },
  'beauty-services': {
    title: 'Beauty & Personal Care at Home | Salon Services | VisvasaHome',
    description: 'Book professional beauty services at your doorstep - salon-quality haircuts, styling, facials, mani-pedi, waxing & makeup at home.',
  },
  'wellness-services': {
    title: 'Wellness & Fitness at Home | Physiotherapy & Yoga | VisvasaHome',
    description: 'Book certified fitness and wellness experts at home. At-home physiotherapy sessions, personal training, yoga instructors, dietitian consults.',
  },
};

function MainApp() {
  // App state management
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(() => {
    return localStorage.getItem('visvasahome_selected_location');
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');
  const [pageData, setPageData] = useState<any>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedPhone = localStorage.getItem('visvasahome_user_phone');
    if (savedPhone) {
      const sessionStr = localStorage.getItem('session_info');
      let sessionValid = true;
      
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (!isSessionValid(session)) {
            sessionValid = false;
          }
        } catch (e) {
          sessionValid = false;
        }
      } else {
        // Initialize session for existing session to prevent immediate logouts
        const newSession = {
          userId: savedPhone,
          createdAt: Date.now(),
          lastActivity: Date.now(),
          deviceFingerprint: generateDeviceFingerprint()
        };
        localStorage.setItem('session_info', JSON.stringify(newSession));
      }

      if (!sessionValid) {
        handleLogout();
        alert('Your session has expired due to inactivity. Please login again.');
      } else {
        setIsAuthenticated(true);
        setUserPhone(savedPhone);
        updateSessionActivity(savedPhone);
      }
    }

    // Check if admin is logged in
    const adminToken = localStorage.getItem('visvasahome_admin_token');
    if (adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // Save selected location to localStorage when it changes
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('visvasahome_selected_location', selectedLocation);
    } else {
      localStorage.removeItem('visvasahome_selected_location');
    }
  }, [selectedLocation]);

  // Update session activity on click/keypress interaction
  useEffect(() => {
    if (!isAuthenticated || !userPhone) return;

    const handleUserActivity = () => {
      updateSessionActivity(userPhone);
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
    };
  }, [isAuthenticated, userPhone]);

  // Scroll to top on page change + track page view
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowMobileMenu(false);
    if (isAnalyticsEnabled()) {
      const meta = seoMeta[currentPage];
      trackPageView(currentPage, meta?.title || 'VisvasaHome');
    }
  }, [currentPage]);

  // Vite Router "Middleware" Guard Simulation (Role Protection Gate & IDOR URL Validation)
  useEffect(() => {
    const adminRole = localStorage.getItem('visvasahome_admin_role');
    const partnerId = localStorage.getItem('visvasahome_partner_id');
    const loggedInPhone = userPhone || localStorage.getItem('visvasahome_user_phone');
    const isUserLoggedIn = isAuthenticated || !!loggedInPhone;

    // 1. Admin Page Guards
    const isAdminPage = currentPage.startsWith('admin-') && currentPage !== 'admin-login';
    if (isAdminPage && !adminRole) {
      console.warn('Access denied: Admin route protected by middleware.');
      navigate('admin-login');
      alert('Access Denied: You must be signed in as an administrator to view this page.');
      return;
    }

    // 2. Partner Page Guards
    const isPartnerPage = (currentPage.startsWith('sp-') || currentPage === 'professional-dashboard') && currentPage !== 'partner-login';
    if (isPartnerPage && !partnerId && !adminRole) {
      console.warn('Access denied: Partner route protected by middleware.');
      if (isAuthenticated) {
        alert('Welcome! It looks like you are not registered as a Service Professional partner yet. Redirecting you to the Partner Registration page.');
        navigate('professional-register');
      } else {
        navigate('login');
        alert('Access Denied: You must be signed in as a Service Professional partner to view this page.');
      }
      return;
    }

    // 3. Customer Dashboard/Protected Guards
    const isProtectedCustomerPage = ['bookings', 'wallet', 'loyalty-dashboard', 'live-tracking', 'amc-dashboard'].includes(currentPage);
    if (isProtectedCustomerPage && !isUserLoggedIn && !adminRole) {
      console.warn('Access denied: Customer route protected by middleware.');
      navigate('login');
      return;
    }

    // 4. URL parameter validation / IDOR prevention for customers
    if (isUserLoggedIn && !adminRole) {
      // A. Live Tracking page authorization check
      if (currentPage === 'live-tracking' && pageData?.bookingId) {
        const bId = pageData.bookingId;
        if (bId.startsWith('VIS-') || bId.startsWith('VISIT')) {
          const savedVisits = localStorage.getItem('visvasahome_amc_visits');
          if (savedVisits) {
            try {
              const parsedVisits = JSON.parse(savedVisits);
              const matchedVisit = parsedVisits.find((v: any) => v.id === bId);
              if (matchedVisit) {
                const savedContracts = localStorage.getItem('visvasahome_amc_contracts');
                if (savedContracts) {
                  const parsedContracts = JSON.parse(savedContracts);
                  const matchedContract = parsedContracts.find((c: any) => c.contractNumber === matchedVisit.contractId);
                  if (matchedContract && matchedContract.customerId !== loggedInPhone) {
                    console.warn('IDOR Blocked: Attempted to access foreign AMC visit tracking.');
                    alert('Security Check: You do not have permission to track this AMC visit.');
                    navigate('home');
                    return;
                  }
                }
              }
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          const booking = BookingService.getBookingById(bId);
          if (booking && loggedInPhone) {
            const cleanBookingPhone = booking.userPhone.replace(/[^\d+]/g, '');
            const cleanUserPhone = loggedInPhone.replace(/[^\d+]/g, '');
            if (cleanBookingPhone !== cleanUserPhone) {
              console.warn('IDOR Blocked: Attempted to access foreign booking tracking page.');
              alert('Security Check: You do not have permission to view this booking.');
              navigate('bookings');
              return;
            }
          }
        }
      }

      // B. Chat page authorization check (block if booking does not match logged-in user)
      if (currentPage === 'chat' && pageData?.bookingId && pageData?.bookingId !== 'SUPPORT_TICKET') {
        const booking = BookingService.getBookingById(pageData.bookingId);
        if (booking && loggedInPhone) {
          const cleanBookingPhone = booking.userPhone.replace(/[^\d+]/g, '');
          const cleanUserPhone = loggedInPhone.replace(/[^\d+]/g, '');
          if (cleanBookingPhone !== cleanUserPhone) {
            console.warn('IDOR Blocked: Attempted to access foreign booking chat.');
            alert('Security Check: Access denied to this booking chat.');
            navigate('home');
            return;
          }
        }
      }

      // C. Submit Review page authorization check
      if (currentPage === 'submit-review' && pageData?.bookingId) {
        const booking = BookingService.getBookingById(pageData.bookingId);
        if (booking && loggedInPhone) {
          const cleanBookingPhone = booking.userPhone.replace(/[^\d+]/g, '');
          const cleanUserPhone = loggedInPhone.replace(/[^\d+]/g, '');
          if (cleanBookingPhone !== cleanUserPhone) {
            console.warn('IDOR Blocked: Attempted to submit review for foreign booking.');
            alert('Security Check: Access denied to rate this booking.');
            navigate('bookings');
            return;
          }
        }
      }

      // D. Contractor Quote Comparison authorization check
      if (currentPage === 'contractor-quote-comparison' && pageData?.projectId) {
        const loggedInUserId = localStorage.getItem('visvasahome_user_id') || localStorage.getItem('visvasahome_vh_id');
        const savedReqs = localStorage.getItem('visvasahome_contractor_requirements');
        if (savedReqs && loggedInUserId) {
          try {
            const parsedReqs = JSON.parse(savedReqs);
            const req = parsedReqs.find((r: any) => r.id === pageData.projectId);
            if (req && req.customerId !== loggedInUserId) {
              console.warn('IDOR Blocked: Attempted to access foreign contractor quotes comparison.');
              alert('Security Check: Access denied to this project quotes comparison.');
              navigate('contractor-hub');
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  }, [currentPage, isAuthenticated, pageData]);

  // Synchronize browser URL hash with app state
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/') {
        setCurrentPage((prev) => (prev !== 'home' ? 'home' : prev));
        setPageData((prev) => (prev !== null ? null : prev));
        return;
      }

      // Format is: #/page-type?param1=val1
      const hashContent = hash.startsWith('#/') ? hash.slice(2) : hash.slice(1);
      const [routePath, queryString] = hashContent.split('?');
      const page = routePath as PageType;

      const data: Record<string, string> = {};
      if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((value, key) => {
          data[key] = value;
        });
      }

      let matchedPage = page;
      if (page.startsWith('partner-city/')) {
        const city = page.replace('partner-city/', '');
        matchedPage = `partner-city-${city}` as PageType;
      }

      setCurrentPage((prev) => (prev !== matchedPage ? matchedPage : prev));

      const newData = Object.keys(data).length > 0 ? data : null;
      setPageData((prev: any) => {
        if (!prev && !newData) return null;
        if (prev && newData) {
          const prevKeys = Object.keys(prev);
          const newKeys = Object.keys(newData);
          if (prevKeys.length === newKeys.length && prevKeys.every(k => prev[k] === newData[k])) {
            return prev;
          }
        }
        return newData;
      });
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    
    // Initial route check on mount
    handleUrlChange();

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const navigate = (page: PageType, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);

    let hash = `#/${page}`;
    if (data) {
      const queryParts = Object.entries(data)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      if (queryParts) {
        hash += `?${queryParts}`;
      }
    }

    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  };

  // Analytics-wrapped CTA helpers
  const bookService = (serviceName: string) => {
    trackServiceCTAClick(serviceName, 'Book Now');
    trackBookingFunnel('service_selected', serviceName);
    navigate('booking-flow');
  };

  const bookAMC = (planType: string) => {
    trackAMCInterest(planType, 'enquire');
    trackBookingFunnel('service_selected', `AMC ${planType}`);
    navigate('amc-booking', { category: planType.toLowerCase() });
  };

  const registerProfessional = () => {
    trackProfessionalRegistration('started');
    navigate('register-contractor');
  };

  const handleLoginSuccess = (phoneNumber: string) => {
    setIsAuthenticated(true);
    setUserPhone(phoneNumber);
    localStorage.setItem('visvasahome_user_phone', phoneNumber);
    
    // Initialize session info
    const newSession = {
      userId: phoneNumber,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      deviceFingerprint: generateDeviceFingerprint()
    };
    localStorage.setItem('session_info', JSON.stringify(newSession));
    
    trackAuthEvent('login_success', 'phone');

    // Middleware Redirection Check:
    // 1. Is Admin?
    const adminRole = localStorage.getItem('visvasahome_admin_role');
    if (adminRole) {
      localStorage.setItem('visvasahome_user_role', 'admin');
      navigate('admin-dashboard');
      return;
    }

    // 2. Is Partner/Professional?
    const savedPros = localStorage.getItem('visvasahome_professionals');
    const professionalsList = savedPros ? JSON.parse(savedPros) : [];
    const matchedPro = professionalsList.find((p: any) => p.phone.replace(/[^\d+]/g, '') === phoneNumber.replace(/[^\d+]/g, ''));
    if (matchedPro) {
      localStorage.setItem('visvasahome_partner_phone', phoneNumber);
      localStorage.setItem('visvasahome_partner_name', matchedPro.name);
      localStorage.setItem('visvasahome_partner_id', matchedPro.id);
      localStorage.setItem('visvasahome_user_role', 'partner');
      navigate('professional-dashboard');
      return;
    }

    // 3. Customer Fallback
    localStorage.setItem('visvasahome_user_role', 'customer');
    const redirectPage = localStorage.getItem('auth_redirect');
    if (redirectPage) {
      localStorage.removeItem('auth_redirect');
      navigate(redirectPage as any);
    } else {
      navigate('home');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserPhone('');
    localStorage.removeItem('visvasahome_user_phone');
    localStorage.removeItem('session_info');
    localStorage.removeItem('visvasahome_user_role');
    localStorage.removeItem('visvasahome_partner_phone');
    localStorage.removeItem('visvasahome_partner_name');
    localStorage.removeItem('visvasahome_partner_id');
    trackAuthEvent('logout');
    navigate('home');
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('visvasahome_user_role', 'admin');
    localStorage.setItem('visvasahome_admin_role', 'super_admin');
    localStorage.setItem('visvasahome_admin_token', 'temp_mock_token');
    navigate('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('visvasahome_admin_token');
    localStorage.removeItem('visvasahome_admin_email');
    localStorage.removeItem('visvasahome_admin_role');
    localStorage.removeItem('visvasahome_user_role');
    navigate('home');
  };

  const handleAdminNavigate = (section: string) => {
    const sectionMap: Record<string, PageType> = {
      'dashboard': 'admin-dashboard',
      'bookings': 'admin-bookings',
      'professionals': 'admin-professionals',
      'customers': 'admin-customers',
      'services': 'admin-services',
      'reports': 'admin-reports',
      'payments': 'admin-payments',
      'reviews': 'admin-reviews',
      'notifications': 'admin-notifications',
      'settings': 'admin-settings',
      'messages': 'admin-messages'
    };
    setAdminSection(section);
    const page = sectionMap[section] || 'admin-dashboard';
    navigate(page);
  };

  const meta = seoMeta[currentPage] || seoMeta['home'];

  const handleBookServiceCTA = () => {
    const cartCount = CartManager.getCart().items.length;
    if (cartCount > 0) {
      navigate('booking-flow');
    } else {
      navigate('get-started-customer');
    }
  };

  const commonHeaderProps = {
    onRegisterContractor: () => { trackCTAClick('Register Contractor', 'header'); navigate('professional-register'); },
    onBookService: () => { trackCTAClick('Book Service', 'header'); handleBookServiceCTA(); },
    onCartOpen: () => setCartDrawerOpen(true),
    selectedLocation,
    onLocationSelect: setSelectedLocation,
    onAMCOffice: () => navigate('amc-office'),
    onAMCHome: () => navigate('amc-home'),
    onAMCCommercial: () => navigate('amc-commercial'),
    onAMCIndustrial: () => navigate('amc-industrial'),
    onAMCHealthcare: () => navigate('amc-healthcare'),
    onAMCEducational: () => navigate('amc-educational'),
    onAMCHospitality: () => navigate('amc-hospitality'),
    onAMCSociety: () => navigate('amc-society'),
    onHome: () => navigate('home'),
  };

  // Login page
  if (currentPage === 'login') {
    return <AuthPage onLoginSuccess={handleLoginSuccess} onBack={() => navigate('home')} />;
  }

  // Forgot Password page
  if (currentPage === 'forgot-password') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ForgotPasswordPage onBack={() => navigate('login')} />
      </>
    );
  }

  // Reset Password page
  if (currentPage === 'reset-password') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ResetPasswordPage
          onSuccess={() => navigate('login')}
          onBack={() => navigate('login')}
        />
      </>
    );
  }

  // Email Signup page
  if (currentPage === 'email-signup') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <EmailSignupPage
          onSuccess={() => navigate('verify-email')}
          onBack={() => navigate('login')}
        />
      </>
    );
  }

  // Verify Email page
  if (currentPage === 'verify-email') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <VerifyEmailPage onSuccess={() => navigate('login')} />
      </>
    );
  }

  // OAuth Callback page
  if (currentPage === 'auth-callback') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <OAuthCallbackPage onSuccess={() => navigate('home')} />
      </>
    );
  }

  // Subscription Management page
  if (currentPage === 'subscription-management') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <SubscriptionManagementPage userId={userPhone || 'user_123'} onBack={() => navigate('profile')} />
      </>
    );
  }

  // Payment Testing page
  if (currentPage === 'payment-testing') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PaymentTestingPage onBack={() => navigate('home')} />
      </>
    );
  }

  // Menu page
  if (currentPage === 'menu') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <MenuPage
          onBack={() => navigate('home')}
          onNavigate={(page) => navigate(page as PageType)}
          isAuthenticated={isAuthenticated}
          onLogin={() => navigate('login')}
        />
      </>
    );
  }

  // Profile page
  if (currentPage === 'profile') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="My Profile | VisvasaHome" description="Manage your VisvasaHome account, bookings, and preferences." />
        <UserProfilePage
          phoneNumber={userPhone}
          onLogout={handleLogout}
          onNavigate={(page) => navigate(page as PageType)}
        />
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={(page) => navigate(page as PageType)}
          onMenuOpen={() => setShowMobileMenu(true)}
        />
      </>
    );
  }

  // Search/Services page
  if (currentPage === 'search') {
    return (
      <>
        <SEO title="Browse Services | VisvasaHome" description="Browse all available services on VisvasaHome." />
        <SearchPage
          onNavigate={(page) => navigate(page as PageType)}
          onBookService={handleBookServiceCTA}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          isAuthenticated={isAuthenticated}
          onLogin={() => navigate('login')}
          onProfile={() => navigate('profile')}
          commonHeaderProps={commonHeaderProps}
          initialQuery={pageData?.query || ''}
        />
      </>
    );
  }

  // Bookings page
  if (currentPage === 'bookings') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="My Bookings | VisvasaHome" description="View and manage your service bookings." />
        <BookingsPage
          onBack={() => navigate('home')}
          onNavigate={(page) => navigate(page as PageType)}
          onBookService={handleBookServiceCTA}
          userPhone={userPhone}
        />
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={(page) => navigate(page as PageType)}
          onMenuOpen={() => setShowMobileMenu(true)}
        />
      </>
    );
  }

  // Edit Profile
  if (currentPage === 'edit-profile') {
    if (!isAuthenticated) { navigate('login'); return null; }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <EditProfilePage onBack={() => navigate('profile')} phoneNumber={userPhone} />
        <MobileBottomNav currentPage={currentPage} onNavigate={(page) => navigate(page as PageType)} onMenuOpen={() => setShowMobileMenu(true)} />
      </>
    );
  }

  // Manage Addresses
  if (currentPage === 'addresses') {
    if (!isAuthenticated) { navigate('login'); return null; }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ManageAddressesPage onBack={() => navigate('profile')} />
        <MobileBottomNav currentPage={currentPage} onNavigate={(page) => navigate(page as PageType)} onMenuOpen={() => setShowMobileMenu(true)} />
      </>
    );
  }

  // Notifications
  if (currentPage === 'notifications') {
    if (!isAuthenticated) { navigate('login'); return null; }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <NotificationsPage onBack={() => navigate('profile')} />
        <MobileBottomNav currentPage={currentPage} onNavigate={(page) => navigate(page as PageType)} onMenuOpen={() => setShowMobileMenu(true)} />
      </>
    );
  }

  // Saved Services
  if (currentPage === 'saved') {
    if (!isAuthenticated) { navigate('login'); return null; }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <SavedServicesPage onBack={() => navigate('profile')} onBookService={handleBookServiceCTA} />
        <MobileBottomNav currentPage={currentPage} onNavigate={(page) => navigate(page as PageType)} onMenuOpen={() => setShowMobileMenu(true)} />
      </>
    );
  }

  // App Settings
  if (currentPage === 'settings') {
    if (!isAuthenticated) { navigate('login'); return null; }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AppSettingsPage onBack={() => navigate('profile')} onLogout={handleLogout} />
        <MobileBottomNav currentPage={currentPage} onNavigate={(page) => navigate(page as PageType)} onMenuOpen={() => setShowMobileMenu(true)} />
      </>
    );
  }

  // Help & Support
  if (currentPage === 'help') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <HelpSupportPage onBack={() => navigate('profile')} onNavigate={(page) => navigate(page as PageType)} />
        <MobileBottomNav currentPage={currentPage} onNavigate={(page) => navigate(page as PageType)} onMenuOpen={() => setShowMobileMenu(true)} />
      </>
    );
  }

  // Competitive Analysis
  if (currentPage === 'competitive-analysis') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <CompetitiveAnalysisPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  // Admin Login
  if (currentPage === 'admin-login') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AdminLoginPage onLoginSuccess={handleAdminLogin} onBack={() => navigate('home')} />
      </>
    );
  }

  // Admin Pages (Require Authentication)
  const isAdminPage = [
    'admin-dashboard',
    'admin-bookings',
    'admin-professionals',
    'admin-customers',
    'admin-services',
    'admin-reports',
    'admin-payments',
    'admin-reviews',
    'admin-notifications',
    'admin-settings',
    'admin-messages'
  ].includes(currentPage);

  if (isAdminPage) {
    if (!isAdminAuthenticated) {
      navigate('admin-login');
      return null;
    }
    const section = currentPage === 'admin-dashboard' ? 'dashboard' : currentPage.replace('admin-', '');
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AdminDashboard
          initialSection={section}
          onLogout={handleAdminLogout}
          onNavigate={handleAdminNavigate}
        />
      </>
    );
  }

  // Service Pages
  if (currentPage === 'plumbing-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PlumbingServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Plumbing')} />
      </>
    );
  }

  if (currentPage === 'electrical-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ElectricalServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Electrical')} />
      </>
    );
  }

  if (currentPage === 'ac-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ACServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('AC Service')} />
      </>
    );
  }

  if (currentPage === 'cleaning-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <CleaningServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Cleaning')} />
      </>
    );
  }

  if (currentPage === 'appliance-repair') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ApplianceRepairPage onBack={() => navigate('home')} onBookNow={() => bookService('Appliance Repair')} />
      </>
    );
  }



  if (currentPage === 'pest-control') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PestControlPage onBack={() => navigate('home')} onBookNow={() => bookService('Pest Control')} />
      </>
    );
  }

  if (currentPage === 'painting-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PaintingServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Painting')} />
      </>
    );
  }

  if (currentPage === 'carpentry-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <CarpentryServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Carpentry')} />
      </>
    );
  }

  if (currentPage === 'interior-design') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <InteriorDesignPage onBack={() => navigate('home')} onBookNow={() => bookService('Interior Design')} />
      </>
    );
  }



  if (currentPage === 'landscaping-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <LandscapingServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Landscaping')} />
      </>
    );
  }

  if (currentPage === 'flooring-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <FlooringServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Flooring')} />
      </>
    );
  }

  if (currentPage === 'masonry-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <MasonryServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Masonry')} />
      </>
    );
  }

  if (currentPage === 'roofing-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <RoofingServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Roofing')} />
      </>
    );
  }

  if (currentPage === 'general-repair') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <GeneralRepairPage onBack={() => navigate('home')} onBookNow={() => bookService('General Repair')} />
      </>
    );
  }

  if (currentPage === 'excavation-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ExcavationServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Excavation')} />
      </>
    );
  }

  if (currentPage === 'care-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <CareServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Care Services')} />
      </>
    );
  }

  if (currentPage === 'event-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <EventServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Event Services')} />
      </>
    );
  }

  if (currentPage === 'construction-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ConstructionServicesPage
          onBack={() => navigate('home')}
          onBookNow={() => bookService('Construction')}
          onNavigate={(page) => navigate(page as PageType)}
        />
      </>
    );
  }

  if (currentPage === 'home-security') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <HomeSecurityPage onBack={() => navigate('home')} onBookNow={() => bookService('Home Security')} />
      </>
    );
  }

  if (currentPage === 'water-purifier-chimney') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <WaterPurifierChimneyPage onBack={() => navigate('home')} onBookNow={() => bookService('Water Purifier & Chimney')} />
      </>
    );
  }

  if (currentPage === 'home-improvement') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <HomeImprovementPage onBack={() => navigate('home')} onBookNow={() => bookService('Home Improvement')} />
      </>
    );
  }

  if (currentPage === 'green-energy') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <GreenEnergyPage onBack={() => navigate('home')} onBookNow={() => bookService('Green Energy')} />
      </>
    );
  }

  if (currentPage === 'car-cleaning') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <CarCleaningPage onBack={() => navigate('home')} onBookNow={() => bookService('Car Cleaning')} />
      </>
    );
  }

  if (currentPage === 'movers-packers') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <MoversPackersPage onBack={() => navigate('home')} onBookNow={() => bookService('Movers & Packers')} />
      </>
    );
  }

  if (currentPage === 'education-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <EducationPage onBack={() => navigate('home')} onBookNow={() => bookService('Education')} />
      </>
    );
  }

  if (currentPage === 'pet-care') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PetCarePage onBack={() => navigate('home')} onBookNow={() => bookService('Pet Care')} />
      </>
    );
  }

  if (currentPage === 'beauty-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <BeautyServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Beauty & Personal Care')} />
      </>
    );
  }

  if (currentPage === 'wellness-services') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <WellnessServicesPage onBack={() => navigate('home')} onBookNow={() => bookService('Wellness & Fitness')} />
      </>
    );
  }

  if (currentPage === 'professional-dashboard') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ProfessionalDashboard
          onBack={() => navigate('home')}
          professionalPhone={userPhone}
        />
      </>
    );
  }

  if (currentPage === 'register-contractor') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <RegisterContractor onBack={() => navigate('home')} />
      </>
    );
  }

  if (currentPage === 'get-started-customer') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <GetStartedCustomer onBack={() => navigate('home')} selectedLocation={selectedLocation} />
      </>
    );
  }

  if (currentPage === 'join-professional') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <JoinProfessional onBack={() => navigate('home')} onRegister={() => navigate('register-contractor')} />
      </>
    );
  }

  if (currentPage === 'professional-register') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ProfessionalRegisterPage onBack={() => navigate('home')} onRegister={registerProfessional} />
      </>
    );
  }

  if (currentPage === 'benefits') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <BenefitsPage onBack={() => navigate('home')} onRegister={() => navigate('register-contractor')} />
      </>
    );
  }

  if (currentPage === 'training-support') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <TrainingSupport onBack={() => navigate('home')} onRegister={() => navigate('register-contractor')} />
      </>
    );
  }

  if (currentPage === 'success-stories') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <SuccessStories onBack={() => navigate('home')} onRegister={() => navigate('register-contractor')} />
      </>
    );
  }

  if (currentPage === 'amc-office') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCOffice onBack={() => navigate('home')} onBookNow={() => bookAMC('Office')} />
      </>
    );
  }

  if (currentPage === 'amc-home') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCHome onBack={() => navigate('home')} onBookNow={() => bookAMC('Home')} />
      </>
    );
  }

  if (currentPage === 'amc-commercial') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCCommercial onBack={() => navigate('home')} onBookNow={() => bookAMC('Commercial')} />
      </>
    );
  }

  if (currentPage === 'amc-industrial') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCIndustrial onBack={() => navigate('home')} onBookNow={() => bookAMC('Industrial')} />
      </>
    );
  }

  if (currentPage === 'amc-healthcare') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCHealthcare onBack={() => navigate('home')} onBookNow={() => bookAMC('Healthcare')} />
      </>
    );
  }

  if (currentPage === 'amc-educational') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCEducational onBack={() => navigate('home')} onBookNow={() => bookAMC('Educational')} />
      </>
    );
  }

  if (currentPage === 'amc-hospitality') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCHospitality onBack={() => navigate('home')} onBookNow={() => bookAMC('Hospitality')} />
      </>
    );
  }

  if (currentPage === 'amc-society') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AMCSociety onBack={() => navigate('home')} onBookNow={() => bookAMC('Society')} />
      </>
    );
  }

  if (currentPage === 'about-us') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AboutUsPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'our-mission') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <OurMissionPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'contact') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ContactPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }


  if (currentPage === 'testimonials') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <TestimonialsPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'blog') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <BlogPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'how-it-works') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <HowItWorksPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'faq') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <FAQPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'privacy-policy') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PrivacyPolicyPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'terms') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <TermsPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'careers') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <CareersPage onBack={() => navigate('home')} />
      </>
    );
  }

  // Contractor Hub
  if (currentPage === 'contractor-hub') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ContractorHubPage
          onBack={() => navigate('home')}
          isAuthenticated={isAuthenticated}
          onLogin={() => navigate('login')}
        />
      </>
    );
  }
  // Booking Flow
  if (currentPage === 'booking-flow') {
    if (!isAuthenticated) {
      localStorage.setItem('auth_redirect', 'booking-flow');
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <BookingFlowPage
          onBack={() => navigate('home')}
          selectedLocation={selectedLocation}
          isAuthenticated={isAuthenticated}
          onLogin={() => navigate('login')}
          onNavigate={navigate}
          onBookingSuccess={(phone, name) => {
            setIsAuthenticated(true);
            setUserPhone(phone);
          }}
        />
      </>
    );
  }

  // Wallet
  if (currentPage === 'wallet') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <WalletPage onBack={() => navigate('profile')} onNavigate={(page) => navigate(page as PageType)} />
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={(page) => navigate(page as PageType)}
          onMenuOpen={() => setShowMobileMenu(true)}
        />
      </>
    );
  }

  // Live Tracking
  if (currentPage === 'live-tracking') {
    // Allow if authenticated in React state, OR if user has phone in localStorage (just completed booking/OTP),
    // OR if a bookingId is passed (post-booking redirect)
    const localPhone = localStorage.getItem('visvasahome_user_phone');
    if (!isAuthenticated && !localPhone && !pageData?.bookingId) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <LiveTrackingPage 
          onBack={() => navigate('bookings')} 
          bookingId={pageData?.bookingId}
          onNavigate={(page, data) => navigate(page as PageType, data)}
        />
      </>
    );
  }

  // Service Professional - Jobs
  if (currentPage === 'sp-jobs') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="My Jobs - Service Professional | VisvasaHome" description="Manage your service jobs and bookings" />
        <SPJobsPage onBack={() => navigate('professional-dashboard')} onNavigate={(page, data) => navigate(page as PageType, data)} />
      </>
    );
  }

  // Service Professional - Job Detail
  if (currentPage === 'sp-job-detail') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="Job Details - Service Professional | VisvasaHome" description="View and manage job details" />
        <SPJobDetailPage jobId={pageData?.jobId || 'JOB001'} onBack={() => navigate('sp-jobs')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  // Service Professional - Earnings
  if (currentPage === 'sp-earnings') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="My Earnings - Service Professional | VisvasaHome" description="Track your earnings and performance" />
        <SPEarningsPage onBack={() => navigate('professional-dashboard')} />
      </>
    );
  }

  // Submit Review
  if (currentPage === 'submit-review') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="Submit Review | VisvasaHome" description="Rate your service experience" />
        <SubmitReviewPage
          bookingId={pageData?.bookingId || 'VH-UNKNOWN'}
          serviceName="Service"
          professionalName="Service Professional"
          onBack={() => navigate('bookings')}
          onSubmit={(data) => {
            // Ideally save to DB here
            console.log('Review submitted', data);
          }}
        />
      </>
    );
  }

  // Support Chat / Professional Chat
  if (currentPage === 'chat') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    const isSupport = pageData?.isSupport || false;
    const supportUser = {
      id: 'vh_support',
      name: 'VisvasaHome Support',
      role: 'professional' as const, // 'professional' role is used to show the agent badge
      online: true
    };
    
    return (
      <>
        <SEO title="Support Chat | VisvasaHome" description="Chat with our support team" />
        <ChatPage
          bookingId={pageData?.bookingId || 'SUPPORT_TICKET'}
          currentUserId={userPhone || 'guest'}
          otherUser={isSupport ? supportUser : (pageData?.otherUser || supportUser)}
          onBack={() => navigate('help')}
        />
      </>
    );
  }

  // Service Professional - Schedule
  if (currentPage === 'sp-schedule') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="My Schedule - Service Professional | VisvasaHome" description="Set your availability hours and block vacation dates" />
        <SPSchedulePage onBack={() => navigate('professional-dashboard')} />
      </>
    );
  }

  // Service Professional - Training Hub
  if (currentPage === 'sp-training') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="Training Hub - Service Professional | VisvasaHome" description="Complete service masterclasses and earn your verified partner certificate" />
        <SPTrainingHubPage onBack={() => navigate('professional-dashboard')} />
      </>
    );
  }

  // AMC Packages
  if (currentPage === 'amc-packages') {
    return (
      <>
        <SEO title="AMC Packages - Annual Maintenance Contracts | VisvasaHome" description="Choose the perfect maintenance plan for your home or office" />
        <AMCPackagesPage onBack={() => navigate('home')} onNavigate={(page, data) => navigate(page as PageType, data)} />
      </>
    );
  }
  // AMC Booking Flow
  if (currentPage === 'amc-booking') {
    if (!isAuthenticated) {
      localStorage.setItem('auth_redirect', 'amc-booking');
      localStorage.setItem('amc_booking_data', JSON.stringify(pageData || {}));
      navigate('login');
      return null;
    }
    const savedPageData = localStorage.getItem('amc_booking_data');
    const actualPageData = pageData || (savedPageData ? JSON.parse(savedPageData) : null);
    if (savedPageData) {
      localStorage.removeItem('amc_booking_data');
    }
    const amcCategory = actualPageData?.category as string | undefined;
    const backPage = amcCategory ? (`amc-${amcCategory}` as PageType) : 'amc-packages' as PageType;
    return (
      <>
        <SEO title="Book AMC Plan | VisvasaHome" description="Subscribe to an Annual Maintenance Contract in minutes. Select your plan, schedule your first visit, and pay securely online." />
        <AMCBookingPage
          onBack={() => navigate(backPage)}
          onNavigate={(page, data) => navigate(page as PageType, data)}
          preSelectedPackageId={actualPageData?.packageId}
          selectedCategory={amcCategory}
          onPaymentSuccess={(phone: string, name: string) => {
            setIsAuthenticated(true);
            setUserPhone(phone);
          }}
        />
      </>
    );
  }

  // AMC Customer Dashboard
  if (currentPage === 'amc-dashboard') {
    // Allow access if authenticated via React state OR if localStorage has a phone (just completed AMC purchase)
    const localPhone = localStorage.getItem('visvasahome_user_phone');
    if (!isAuthenticated && !localPhone) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="My AMC Dashboard | VisvasaHome" description="Manage your Annual Maintenance Contract subscription, view upcoming visits and service reports" />
        <AMCManagementDashboard onBack={() => navigate('profile')} onNavigate={(page, data) => navigate(page as PageType, data)} />
      </>
    );
  }

  // Loyalty & Rewards Dashboard
  if (currentPage === 'loyalty-dashboard') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="Rewards & Referrals | VisvasaHome" description="Earn points and refer friends" />
        <LoyaltyDashboardPage onBack={() => navigate('wallet')} />
      </>
    );
  }

  // Contractor Quote Comparison
  if (currentPage === 'contractor-project') {
    return (
      <>
        <SEO title="Hire a Contractor | VisvasaHome" description="Hire a verified contractor for your project." />
        <ContractorProjectPage
          categorySlug={pageData?.categorySlug || 'contractor'}
          categoryName={pageData?.categoryName || 'Contractors'}
          onBack={() => navigate('home')}
          onContinue={(data) => navigate('contractor-directory', { projectData: data })}
        />
      </>
    );
  }

  if (currentPage === 'contractor-directory') {
    return (
      <>
        <SEO title="Contractor Directory | VisvasaHome" description="Browse verified contractors and request quotes." />
        <ContractorDirectoryPage
          projectData={pageData?.projectData}
          onBack={() => navigate('home')}
          onRequestQuote={(contractorId) => navigate('contractor-quote-comparison', { projectId: contractorId })}
        />
      </>
    );
  }

  if (currentPage === 'contractor-quote-comparison') {
    if (!isAuthenticated) {
      navigate('login');
      return null;
    }
    return (
      <>
        <SEO title="Compare Contractor Quotes | VisvasaHome" description="Compare quotes from verified contractors" />
        <ContractorQuoteComparisonPage projectId={pageData?.projectId || 'REQ001'} onBack={() => navigate('contractor-hub')} onNavigate={(page, data) => navigate(page as PageType, data)} />
      </>
    );
  }

  // Investor Relations
  if (currentPage === 'investor-relations') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <InvestorRelationsPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  // Partner Portal Pages
  if (currentPage === 'partner-home') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerHomePage onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'partner-about') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerAboutPage onBack={() => navigate('partner-home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  if (currentPage === 'partner-terms') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerTermsPage onBack={() => navigate('partner-home')} />
      </>
    );
  }

  if (currentPage === 'partner-privacy') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerPrivacyPage onBack={() => navigate('partner-home')} />
      </>
    );
  }

  if (currentPage === 'partner-anti-discrimination') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerAntiDiscriminationPage onBack={() => navigate('partner-home')} />
      </>
    );
  }

  if (currentPage === 'partner-info-security') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerInfoSecurityPage onBack={() => navigate('partner-home')} />
      </>
    );
  }

  if (currentPage === 'partner-welfare') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerWelfarePage onBack={() => navigate('partner-home')} />
      </>
    );
  }

  // Partner City Pages
  if (currentPage.startsWith('partner-city-')) {
    const city = currentPage.replace('partner-city-', '');
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <PartnerCityPage
          city={city}
          onBack={() => navigate('partner-home')}
          onRegister={() => navigate('partner-home')}
        />
      </>
    );
  }

  // Partner Login (redirect to main auth for now)
  if (currentPage === 'partner-login') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <AuthPage onLoginSuccess={handleLoginSuccess} onBack={() => navigate('partner-home')} />
      </>
    );
  }

  // Refund Policy page
  if (currentPage === 'refund-policy') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <RefundPolicyPage onBack={() => navigate('home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  // Services & Pricing page
  if (currentPage === 'services-pricing') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <ServicesPricingPage
          onBack={() => navigate('home')}
          onNavigate={(page) => navigate(page as PageType)}
          onBookNow={() => navigate('get-started-customer')}
        />
      </>
    );
  }

  // Partner FAQ (redirect to main FAQ for now)
  if (currentPage === 'partner-faq') {
    return (
      <>
        <SEO title={meta.title} description={meta.description} />
        <FAQPage onBack={() => navigate('partner-home')} onNavigate={(page) => navigate(page as PageType)} />
      </>
    );
  }

  // Home Page
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, localBusinessSchema, serviceSchema, websiteSchema],
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-gray-50">
      <SEO
        title={meta.title}
        description={meta.description}
        structuredData={homeStructuredData}
      />
      
      {/* Mobile Top Bar */}
      <MobileTopBar 
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
        isAuthenticated={isAuthenticated}
        onLogin={() => navigate('login')}
        onProfile={() => navigate('profile')}
        onCartOpen={() => setCartDrawerOpen(true)}
      />

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <Header
          {...commonHeaderProps}
          onNavigate={(page) => navigate(page as PageType)}
          isAuthenticated={isAuthenticated}
          onLogin={() => navigate('login')}
          onProfile={() => navigate('profile')}
          onCartOpen={() => setCartDrawerOpen(true)}
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-[calc(80px+env(safe-area-inset-bottom))]" id="main-scroll-container">
        <Hero
          selectedLocation={selectedLocation}
          onGetStarted={() => { trackCTAClick('Book Service', 'hero'); navigate('booking-flow'); }}
          onRegisterContractor={() => { trackCTAClick('Register Contractor', 'hero'); navigate('professional-register'); }}
          onContractorHub={() => { trackCTAClick('Contractor Hub', 'hero'); navigate('contractor-hub'); }}
          onCategoryClick={(slug, data) => navigate(slug as PageType, data)}
        />
        <MobileContactBar />
        <HomeCategories onCategoryClick={(slug) => {
          trackCTAClick(slug, 'home_categories');
          navigate(slug as PageType);
        }} />
        <ServicesOffered onServiceClick={(slug) => {
          if (slug) {
            trackCTAClick(slug, 'services_grid');
            navigate(slug as PageType);
          } else {
            trackCTAClick('Book Service', 'services_grid');
            navigate('get-started-customer');
          }
        }} />


        <div className="hidden lg:block">
          <Footer
            onNavigate={(page) => navigate(page as PageType)}
            onRegisterContractor={() => navigate('professional-register')}
          />
        </div>
      </div>

      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={(page) => navigate(page as PageType)}
        onMenuOpen={() => setShowMobileMenu(true)}
      />
      <WhatsAppFloatingButton />
      <FloatingFeedbackButton />
      <CookieConsent onPreferencesClick={() => navigate('privacy-policy')} />
      <InteractiveTour />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
      <DemoSandboxPanel />
    </ToastProvider>
  );
}
