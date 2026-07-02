import { ArrowLeft } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerTermsPageProps {
  onBack: () => void;
}

export function PartnerTermsPage({ onBack }: PartnerTermsPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
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
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl mb-4">Partner Terms & Conditions</h1>
        <p className="text-slate-600 mb-8">Last updated: June 9, 2026</p>

        <Card className="mb-6">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              These Terms and Conditions ("Terms") govern the relationship between Visvasa Pvt. Ltd. ("VisvasaHome", "Company", "we", "us") and service professionals, contractors, and skilled workers ("Partner", "you") who register and provide services through the VisvasaHome platform.
            </p>
            <p>
              By registering as a Partner on VisvasaHome, you agree to be bound by these Terms. If you do not agree with these Terms, please do not register or use the Platform.
            </p>

            <h2>2. Eligibility & Registration</h2>
            <h3>2.1 Eligibility Criteria</h3>
            <p>To register as a Partner, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Be an Indian citizen or have valid work authorization in India</li>
              <li>Possess the necessary skills, licenses, and certifications for your service category</li>
              <li>Have a valid Indian mobile number and bank account</li>
              <li>Provide accurate and complete information during registration</li>
            </ul>

            <h3>2.2 Verification Process</h3>
            <p>All Partners must complete our verification process, which includes:</p>
            <ul>
              <li>Identity verification (Aadhaar, PAN, or other government-issued ID)</li>
              <li>Background check and police verification</li>
              <li>Skills assessment and proficiency testing</li>
              <li>Document verification (certifications, licenses where applicable)</li>
              <li>In-person or video interview (as required)</li>
            </ul>
            <p>
              VisvasaHome reserves the right to reject any registration or revoke Partner status at any time if verification requirements are not met or if fraudulent information is provided.
            </p>

            <h2>3. Partner Obligations</h2>
            <h3>3.1 Service Quality Standards</h3>
            <p>Partners are required to:</p>
            <ul>
              <li>Provide services professionally, competently, and in accordance with industry standards</li>
              <li>Complete assigned jobs within the agreed timeframe</li>
              <li>Use appropriate tools, equipment, and materials</li>
              <li>Follow safety protocols and maintain cleanliness at customer locations</li>
              <li>Maintain professional conduct and courteous behavior with customers</li>
              <li>Comply with all applicable laws, regulations, and local ordinances</li>
            </ul>

            <h3>3.2 Availability & Acceptance</h3>
            <ul>
              <li>Partners control their own schedules and decide which jobs to accept</li>
              <li>Once a job is accepted, Partners must honor the commitment unless unforeseen circumstances prevent completion</li>
              <li>Partners must update availability status accurately in the Partner app</li>
              <li>Repeated cancellations or no-shows may result in account suspension or termination</li>
            </ul>

            <h3>3.3 App Usage & Communication</h3>
            <ul>
              <li>Partners must install and actively use the VisvasaHome Partner mobile app</li>
              <li>All job communication must occur through the Platform</li>
              <li>Partners must respond to job requests within the specified timeframe</li>
              <li>Partners must update job status (en route, started, completed) in real-time</li>
            </ul>

            <h2>4. Compensation & Payments</h2>
            <h3>4.1 Earnings Structure</h3>
            <ul>
              <li>Partners earn a predetermined rate for each service based on service type, complexity, and location</li>
              <li>Rates are clearly communicated before job acceptance</li>
              <li>Additional charges (materials, travel beyond 5km) are passed through to Partners as per pricing policy</li>
              <li>AMC services provide recurring monthly income as per the AMC compensation structure</li>
            </ul>

            <h3>4.2 Payment Terms</h3>
            <ul>
              <li>Payments are processed weekly (every Monday for jobs completed in the previous week)</li>
              <li>Payments are made directly to the Partner's registered bank account via NEFT/IMPS</li>
              <li>Minimum payout threshold: ₹500 (earnings below this threshold roll over to the next cycle)</li>
              <li>Payment disputes must be raised within 7 days of payout</li>
            </ul>

            <h3>4.3 Deductions & Withholdings</h3>
            <p>VisvasaHome may deduct or withhold payments for:</p>
            <ul>
              <li>Platform commission (as per partner agreement, typically 15-25% depending on service category)</li>
              <li>TDS (Tax Deducted at Source) as required by Indian tax law</li>
              <li>Customer refunds for justified complaints or service failures</li>
              <li>Penalties for policy violations (as specified in Section 8)</li>
              <li>Outstanding dues or advance payments</li>
            </ul>

            <h2>5. Independent Contractor Relationship</h2>
            <p>
              Partners are independent contractors, not employees of VisvasaHome. This means:
            </p>
            <ul>
              <li>Partners control their own work schedule, methods, and availability</li>
              <li>Partners are responsible for their own taxes, insurance, and statutory compliances</li>
              <li>Partners are not entitled to employee benefits (PF, ESI, gratuity, leave pay)</li>
              <li>VisvasaHome does not provide employment benefits or employment contracts</li>
              <li>This relationship does not create employer-employee, principal-agent, or partnership relationships</li>
            </ul>
            <p>
              However, VisvasaHome may offer voluntary benefits such as accident insurance, training programs, and community support that do not alter this independent contractor status.
            </p>

            <h2>6. Customer Interactions & Conduct</h2>
            <h3>6.1 Professional Conduct</h3>
            <p>Partners must:</p>
            <ul>
              <li>Treat all customers with respect, professionalism, and courtesy</li>
              <li>Maintain appropriate boundaries and professional behavior</li>
              <li>Respect customer property, privacy, and security</li>
              <li>Avoid soliciting tips or additional payments outside the Platform</li>
              <li>Refrain from making personal or political comments to customers</li>
            </ul>

            <h3>6.2 Prohibited Activities</h3>
            <p>Partners are strictly prohibited from:</p>
            <ul>
              <li>Engaging in any form of harassment, discrimination, or inappropriate behavior</li>
              <li>Requesting or accepting direct payments from customers (all payments must go through the Platform)</li>
              <li>Soliciting customers to hire them directly outside the Platform</li>
              <li>Sharing customer contact information or personal data with third parties</li>
              <li>Damaging customer property or stealing</li>
              <li>Working under the influence of alcohol or drugs</li>
            </ul>
            <p>
              Violation of these conduct policies may result in immediate account suspension and legal action.
            </p>

            <h2>7. Ratings, Reviews & Performance</h2>
            <h3>7.1 Rating System</h3>
            <ul>
              <li>Customers rate Partners on a 5-star scale after each service</li>
              <li>Average ratings are displayed on Partner profiles</li>
              <li>Partners with ratings below 3.5 may be subject to performance review or account suspension</li>
              <li>Consistently high-rated Partners (4.7+) may receive priority job allocation and bonuses</li>
            </ul>

            <h3>7.2 Customer Reviews</h3>
            <ul>
              <li>Customers may leave written reviews about their experience</li>
              <li>Reviews are moderated for inappropriate content but are not edited for negative feedback</li>
              <li>Partners may respond to reviews through the Platform</li>
              <li>Fake reviews or review manipulation is strictly prohibited and grounds for termination</li>
            </ul>

            <h2>8. Policy Violations & Penalties</h2>
            <h3>8.1 Warning System</h3>
            <ul>
              <li>First violation: Written warning and mandatory retraining</li>
              <li>Second violation: Account suspension for 7-30 days (depending on severity)</li>
              <li>Third violation: Permanent account termination</li>
            </ul>

            <h3>8.2 Immediate Termination Offenses</h3>
            <p>The following violations result in immediate account termination without warning:</p>
            <ul>
              <li>Theft, fraud, or criminal activity</li>
              <li>Sexual harassment or any form of misconduct</li>
              <li>Violence or threats toward customers or VisvasaHome staff</li>
              <li>Providing false credentials or identity fraud</li>
              <li>Soliciting customers for competing platforms</li>
            </ul>

            <h3>8.3 Financial Penalties</h3>
            <ul>
              <li>No-show without cancellation: ₹500 deduction + job ban for 7 days</li>
              <li>Late arrival (&gt;30 min without notice): ₹200 deduction</li>
              <li>Justified customer complaint: ₹300-₹1000 deduction depending on issue severity</li>
              <li>Soliciting direct payment: Account termination + forfeiture of pending earnings</li>
            </ul>

            <h2>9. Liability & Indemnification</h2>
            <h3>9.1 Partner Liability</h3>
            <p>Partners are solely responsible for:</p>
            <ul>
              <li>Any damage to customer property caused during service delivery</li>
              <li>Personal injury or harm caused to customers or third parties due to Partner negligence</li>
              <li>Compliance with all applicable laws and regulations</li>
              <li>Ensuring they have appropriate licenses and permits for their work</li>
            </ul>

            <h3>9.2 Platform Liability Limitations</h3>
            <p>
              VisvasaHome acts as a technology platform connecting Partners with customers. We do not directly provide services and are not liable for:
            </p>
            <ul>
              <li>Quality of service provided by Partners</li>
              <li>Injuries, damages, or losses arising from Partner services</li>
              <li>Disputes between Partners and customers</li>
              <li>Partner compliance with tax, insurance, or legal obligations</li>
            </ul>

            <h3>9.3 Indemnification</h3>
            <p>
              Partners agree to indemnify and hold harmless VisvasaHome, its directors, employees, and affiliates from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Services provided by the Partner</li>
              <li>Partner's breach of these Terms</li>
              <li>Partner's violation of any applicable law</li>
              <li>Negligent or intentional acts of the Partner</li>
            </ul>

            <h2>10. Insurance & Benefits</h2>
            <h3>10.1 Accident Insurance</h3>
            <ul>
              <li>Active Partners (minimum 10 jobs/month) are covered under a group accident insurance policy</li>
              <li>Coverage: Up to ₹5 lakhs for accidental death or permanent disability occurring during service delivery</li>
              <li>Claims must be filed within 30 days of the incident</li>
              <li>Policy terms and exclusions apply as per the master insurance policy</li>
            </ul>

            <h3>10.2 Health Benefits</h3>
            <ul>
              <li>Top-performing Partners (50+ jobs/month with 4.5+ rating) may access subsidized health checkups</li>
              <li>Telemedicine consultations available through partner wellness program</li>
              <li>Emergency medical support coordination (not direct financial coverage)</li>
            </ul>

            <h2>11. Data Privacy & Confidentiality</h2>
            <h3>11.1 Data Collection & Use</h3>
            <p>VisvasaHome collects and processes Partner data including:</p>
            <ul>
              <li>Personal information (name, contact details, ID documents)</li>
              <li>Professional credentials and work history</li>
              <li>Location data during job execution</li>
              <li>Performance metrics and ratings</li>
              <li>Financial information (bank account, transaction history)</li>
            </ul>
            <p>
              This data is used for verification, job allocation, payment processing, and platform improvement. See our Privacy Policy for full details.
            </p>

            <h3>11.2 Partner Confidentiality Obligations</h3>
            <p>Partners must:</p>
            <ul>
              <li>Maintain confidentiality of customer information obtained during services</li>
              <li>Not disclose customer details (address, phone number, service history) to third parties</li>
              <li>Protect Platform proprietary information including pricing algorithms, business processes, and customer data</li>
            </ul>

            <h2>12. Termination</h2>
            <h3>12.1 Partner-Initiated Termination</h3>
            <p>Partners may terminate their account at any time by:</p>
            <ul>
              <li>Submitting a termination request through the Partner app or contacting support</li>
              <li>Completing all pending jobs or arranging for replacement</li>
              <li>Settling any outstanding financial obligations</li>
            </ul>
            <p>
              Final payment for completed jobs will be processed in the next payment cycle after termination.
            </p>

            <h3>12.2 Platform-Initiated Termination</h3>
            <p>VisvasaHome may terminate Partner accounts for:</p>
            <ul>
              <li>Repeated policy violations</li>
              <li>Poor performance (sustained rating below 3.5 for 3 consecutive months)</li>
              <li>Inactivity (no jobs accepted for 90 consecutive days)</li>
              <li>Providing false information during registration or verification</li>
              <li>Engaging in prohibited activities</li>
            </ul>
            <p>
              In case of termination, Partners forfeit access to the Platform and pending benefits, but will receive payment for completed services.
            </p>

            <h2>13. Intellectual Property</h2>
            <p>
              All intellectual property related to the VisvasaHome Platform including trademarks, logos, app design, and proprietary technology remains the exclusive property of Visvasa Pvt. Ltd.
            </p>
            <p>Partners are granted a limited, non-exclusive, non-transferable license to use the Platform solely for providing services as per these Terms.</p>

            <h2>14. Dispute Resolution</h2>
            <h3>14.1 Escalation Process</h3>
            <ul>
              <li>Step 1: Raise issue through Partner app support (response within 24 hours)</li>
              <li>Step 2: Escalate to Partner Relations Manager (resolution within 3 business days)</li>
              <li>Step 3: Final escalation to Grievance Officer (resolution within 7 business days)</li>
            </ul>

            <h3>14.2 Arbitration</h3>
            <p>
              Disputes not resolved through internal escalation shall be settled through binding arbitration in Jaipur, India under the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English or Hindi at the Partner's choice.
            </p>

            <h2>15. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.
            </p>

            <h2>16. Amendments</h2>
            <p>
              VisvasaHome reserves the right to modify these Terms at any time. Partners will be notified of material changes via email and in-app notification. Continued use of the Platform after such modifications constitutes acceptance of the revised Terms.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              For questions about these Terms or Partner support, contact us at:
            </p>
            <ul>
              <li>Email: partners@visvasahome.com</li>
              <li>Phone: 1800-XXX-XXXX</li>
              <li>Address: Visvasa Pvt. Ltd., Jaipur, Rajasthan, India</li>
            </ul>

            <div className="mt-8 p-4 bg-slate-100 rounded-lg">
              <p className="text-sm">
                <strong>Acknowledgment:</strong> By registering as a Partner on VisvasaHome, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
