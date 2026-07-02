import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface RefundPolicyPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function RefundPolicyPage({ onBack, onNavigate }: RefundPolicyPageProps) {
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
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white">Cancellation & Refund Policy</h1>
          </div>
          <p className="text-blue-100">Last updated: June 2026 | Fair, transparent rules for cancellations and refunds</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10 text-gray-700 leading-relaxed text-sm">
            <p>
              At <strong>VisvasaHome</strong>, we strive to build trust and transparency. We understand that plans can change. This Cancellation & Refund Policy outlines the guidelines, timelines, and procedures for bookings, subscriptions, and contractor milestones on our platform.
            </p>
          </div>

          <div className="space-y-10">
            {[
              {
                title: '1. Standard Bookings - Cancellation Policy',
                content: `• Free Cancellation: Customers can cancel or reschedule bookings free of charge up to 4 hours before the scheduled service start time.
• Late Cancellation Fee: Cancellations or rescheduling requests made with less than 4 hours' notice before the scheduled slot will incur a nominal convenience fee of ₹99. This amount is directly transferred to the assigned service professional to compensate for their travel preparation and blocked slot.
• No-Show Rule: If our service professional arrives at your location and is unable to gain access or contact you within 20 minutes of arrival, the booking will be treated as a late cancellation, and a ₹99 fee will apply.`,
              },
              {
                title: '2. Refund Timelines & Methods',
                content: `• Approved Refunds: Refunds are initiated immediately upon approval of a valid cancellation or dispute claim.
• Source Account Credit: Refunds are processed back to the original payment source (Credit/Debit Card, Net Banking, UPI, Wallet) and typically reflect in your account within 5 to 7 business days, depending on bank processing times.
• Cash-on-Delivery (COD) Orders: For bookings made via Cash-on-Delivery, if a refund is approved, we will request your bank account details or UPI ID to initiate an electronic transfer. These refunds are completed within 3 business days.`,
              },
              {
                title: '3. AMC (Annual Maintenance Contracts) Policies',
                content: `• Trial Period: You may cancel your AMC subscription within 15 days of purchase for a full refund, provided no service visits have been scheduled or completed.
• Prorated Refunds: If you cancel after 15 days, we provide a prorated refund based on the remaining months, minus the standalone value of any service visits already completed during the contract term.
• Auto-Renewal Cancellations: You can toggle auto-renewal settings in your AMC Dashboard. If you cancel an upcoming auto-renewal, your contract will remain active until the end of the current paid period, and no further charges will apply.`,
              },
              {
                title: '4. Contractor & Construction Projects (Milestones)',
                content: `• Escrow Holding: Payments for large renovation or construction projects are split into milestones and held securely in escrow.
• Milestone Approvals: When a contractor completes a milestone and uploads proof of work, the customer reviews it. Once the customer clicks "Approve & Release", the milestone funds are permanently transferred to the contractor and are non-refundable.
• Dispute Resolution: In case of disagreements on milestone quality, the funds remain in escrow. Our dispute team will inspect the site and issue a mediation decision within 5 business days, after which funds will be pro-rated or returned to the customer accordingly.`,
              },
              {
                title: '5. Force Majeure & Platform Cancellations',
                content: `• Weather & Emergencies: In cases of severe weather, lockdowns, or local emergencies preventing our professionals from reaching your premises, the booking is rescheduled without charge or fully refunded.
• Partner Availability: If a professional is unable to fulfill a booking due to emergency, and we are unable to assign an alternative professional, the booking will be cancelled, and any prepaid amount will be refunded 100%.`,
              },
              {
                title: '6. How to Raise a Refund Request',
                content: `If you have any questions or wish to request a refund, please follow these steps:
1. Go to "My Bookings" in your dashboard, select the booking, and click "Request Refund".
2. Alternatively, email our customer support at support@visvasahome.com with your booking ID (e.g. VH-12345) and the reason for refund.
3. Call our support team directly at +91 905 7567 160.

Our support team is available Mon-Sat from 9:00 AM to 7:00 PM and will review your request within 24 hours.`,
              },
            ].map((section, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
