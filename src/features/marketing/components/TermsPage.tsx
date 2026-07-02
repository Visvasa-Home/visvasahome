import { ArrowLeft, FileText } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface TermsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function TermsPage({ onBack, onNavigate }: TermsPageProps) {
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

      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white">Terms of Service</h1>
          </div>
          <p className="text-blue-100">Last updated: June 2026 | Governs all use of VisvasaHome services and platform</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-10">
            <p className="text-yellow-800 text-sm leading-relaxed">
              <strong>Important:</strong> Please read these Terms of Service carefully before using VisvasaHome. By accessing our platform, website, or booking any service, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>
          </div>

          <div className="space-y-10">
            {[
              {
                title: '1. Definitions',
                content: `In these Terms:
• "Platform" refers to the VisvasaHome website (www.visvasahome.com), mobile presence, and any associated communication channels.
• "Customer" refers to any individual or organization booking services through VisvasaHome.
• "Professional" or "Contractor" refers to verified service providers listed on the VisvasaHome platform.
• "Company" refers to Visvasa Pvt. Ltd., operating as VisvasaHome, based in Jaipur, Rajasthan, India.
• "Services" refers to all home, office, and lifestyle services facilitated through the platform.`,
              },
              {
                title: '2. Nature of Service',
                content: `VisvasaHome is a service marketplace that connects Customers with independent verified Professionals. The Company facilitates bookings, verifies professionals, and monitors service quality. However, the Professionals are independent contractors and not employees of VisvasaHome.

The Company is responsible for:
• The verification and onboarding of Professionals
• Facilitating communication and booking management
• Quality monitoring and dispute resolution support

The Company is not responsible for:
• The independent actions of Professionals during service delivery
• Outcomes where Customers have provided incorrect information
• Force majeure events beyond reasonable control`,
              },
              {
                title: '3. Customer Obligations',
                content: `By booking a service, Customers agree to:
• Provide accurate and complete information about the service requirement and location
• Ensure safe and appropriate access to the premises for the assigned Professional
• Treat Professionals with respect and not engage in harassment, abuse, or discrimination
• Pay the agreed service amount through authorized payment channels
• Not attempt to bypass VisvasaHome and book Professionals directly to avoid platform fees
• Report concerns or dissatisfaction through official channels rather than confronting Professionals directly`,
              },
              {
                title: '4. Professional Obligations',
                content: `All Professionals registered on VisvasaHome agree to:
• Provide accurate credentials and comply with the verification process
• Deliver services to the quality standards set by VisvasaHome
• Arrive at the scheduled time or notify in advance of delays
• Not request payments outside the platform's authorized channels
• Maintain professional behavior at all times on Customer premises
• Comply with all applicable laws, safety regulations, and industry standards relevant to their trade`,
              },
              {
                title: '5. Pricing and Payments',
                content: `All service prices are communicated transparently before work begins. Prices shown include the service charge. Additional materials or components, if required, are quoted separately with Customer approval before procurement.

Payment is collected after service completion, unless a deposit is required for large-scale projects. All payments must be made through VisvasaHome's authorized payment channels. Off-platform payments are not covered by any warranty or dispute resolution process.

VisvasaHome reserves the right to update pricing structures with reasonable notice.`,
              },
              {
                title: '6. Cancellation and Rescheduling',
                content: `Customers may cancel or reschedule bookings without charge up to 4 hours before the scheduled service time. Cancellations made with less than 4 hours\' notice may incur a cancellation fee equivalent to the travel and preparation costs of the Professional.

For AMC plans, cancellations are handled as per the specific AMC agreement terms. Early termination of annual AMC plans may be subject to a pro-rated refund after deduction of services already rendered.`,
              },
              {
                title: '7. Warranty and Liability',
                content: `VisvasaHome offers workmanship warranties on completed services ranging from 7 to 30 days, depending on the service category. If the same issue recurs within the warranty period, we revisit at no additional charge.

The Company's liability is limited to the value of the service booked. We are not liable for:
• Pre-existing conditions or damage not related to the service performed
• Indirect or consequential losses
• Damage caused by Customer misuse after service completion

For AMC plans, specific warranty terms are included in the AMC agreement document.`,
              },
              {
                title: '8. Intellectual Property',
                content: `All content on the VisvasaHome platform — including but not limited to the name "VisvasaHome", logo, website design, service descriptions, and written content — is the intellectual property of Visvasa Pvt. Ltd. Unauthorized reproduction, distribution, or use of this content without written permission is prohibited.`,
              },
              {
                title: '9. Dispute Resolution',
                content: `In case of any dispute between a Customer and a Professional, contact VisvasaHome customer support at contact@visvasahome.com or +91 905 7567 160 within 48 hours of the service. Our quality team will investigate and mediate within 5 business days.

If a resolution cannot be reached through our internal process, disputes shall be governed by the laws of India, and parties agree to submit to the jurisdiction of courts in Jaipur, Rajasthan.`,
              },
              {
                title: '10. Amendments',
                content: `VisvasaHome reserves the right to amend these Terms at any time. Significant changes will be communicated to registered users via email or website notification. Continued use of the platform after changes constitutes acceptance of the updated Terms.`,
              },
              {
                title: '11. Contact',
                content: `For questions about these Terms, contact us at:\n\nEmail: contact@visvasahome.com\nPhone: +91 905 7567 160\nAddress: VisvasaHome (Visvasa Pvt. Ltd.), Jaipur, Rajasthan, India — 302001`,
              },
            ].map((section, idx) => (
              <div key={idx}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
