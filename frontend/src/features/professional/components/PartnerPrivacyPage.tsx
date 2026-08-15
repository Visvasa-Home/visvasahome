import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerPrivacyPageProps {
  onBack: () => void;
}

export function PartnerPrivacyPage({ onBack }: PartnerPrivacyPageProps) {
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h1 className="text-4xl">Partner Privacy Policy</h1>
        </div>
        <p className="text-slate-600 mb-8">Last updated: June 9, 2026</p>

        {/* Key Principles */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Data Protection</h3>
              <p className="text-sm text-slate-600">Your data is encrypted and securely stored</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-sm text-slate-600">Clear disclosure of data collection and usage</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Rights</h3>
              <p className="text-sm text-slate-600">Full control over your personal information</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Visvasa Pvt. Ltd. ("VisvasaHome", "we", "us", "our") respects the privacy of our service professional partners ("Partners", "you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you register and use the VisvasaHome Partner Platform.
            </p>
            <p>
              By registering as a Partner, you consent to the collection and use of your information as described in this Privacy Policy. If you do not agree with this Privacy Policy, please do not register or use the Platform.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <p><strong>Registration & Profile Information:</strong></p>
            <ul>
              <li>Personal details: Full name, date of birth, gender, profile photo</li>
              <li>Contact information: Mobile number, email address, residential address</li>
              <li>Identity documents: Aadhaar, PAN card, driver's license, voter ID</li>
              <li>Professional details: Service category, skills, experience, certifications</li>
              <li>Financial information: Bank account details, UPI ID, IFSC code</li>
              <li>Emergency contact information</li>
            </ul>

            <p><strong>Verification Documents:</strong></p>
            <ul>
              <li>Government-issued ID proofs</li>
              <li>Police verification and background check records</li>
              <li>Professional licenses and certifications (where applicable)</li>
              <li>Educational certificates and training records</li>
              <li>Previous employment references</li>
            </ul>

            <h3>2.2 Information We Collect Automatically</h3>
            <p><strong>Location Data:</strong></p>
            <ul>
              <li>Real-time GPS location when the Partner app is active</li>
              <li>Location during job execution for customer tracking and safety</li>
              <li>Work area preferences and service radius</li>
            </ul>

            <p><strong>Device & App Usage Data:</strong></p>
            <ul>
              <li>Device information: Type, model, operating system, unique device ID</li>
              <li>App usage patterns: Login times, feature usage, session duration</li>
              <li>Network information: IP address, carrier, connection type</li>
              <li>Crash logs and error reports for technical support</li>
            </ul>

            <p><strong>Performance & Service Data:</strong></p>
            <ul>
              <li>Job acceptance/rejection rates</li>
              <li>Service completion times and punctuality records</li>
              <li>Customer ratings and reviews</li>
              <li>Earnings history and transaction records</li>
              <li>Training completion and skill assessments</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <ul>
              <li>Background verification reports from authorized agencies</li>
              <li>Police verification records from government databases</li>
              <li>Credit information from credit bureaus (if applicable)</li>
              <li>Social media profile information (if you choose to link accounts)</li>
            </ul>

            <h2>3. How We Use Your Information</h2>

            <h3>3.1 Core Platform Operations</h3>
            <ul>
              <li><strong>Account Management:</strong> Create and maintain your Partner profile, verify identity, authenticate login</li>
              <li><strong>Job Allocation:</strong> Match you with appropriate service requests based on skills, location, and availability</li>
              <li><strong>Service Execution:</strong> Enable real-time tracking, customer communication, and job status updates</li>
              <li><strong>Payment Processing:</strong> Calculate earnings, process payouts, generate invoices and tax documents</li>
            </ul>

            <h3>3.2 Safety & Trust</h3>
            <ul>
              <li>Verify Partner identity and credentials to ensure customer safety</li>
              <li>Conduct background checks and police verification</li>
              <li>Monitor for fraudulent activity and policy violations</li>
              <li>Investigate customer complaints and service quality issues</li>
              <li>Provide location tracking for partner and customer safety during service</li>
            </ul>

            <h3>3.3 Performance Improvement</h3>
            <ul>
              <li>Analyze service quality and identify training needs</li>
              <li>Provide performance feedback and improvement recommendations</li>
              <li>Develop personalized training programs</li>
              <li>Recognize high-performing Partners with incentives and rewards</li>
            </ul>

            <h3>3.4 Communication</h3>
            <ul>
              <li>Send job notifications and service requests</li>
              <li>Provide platform updates and policy changes</li>
              <li>Share training opportunities and skill development programs</li>
              <li>Deliver earnings reports and payment notifications</li>
              <li>Respond to support requests and resolve issues</li>
            </ul>

            <h3>3.5 Legal Compliance</h3>
            <ul>
              <li>Comply with KYC (Know Your Customer) regulations</li>
              <li>Process TDS (Tax Deducted at Source) and generate Form 16A</li>
              <li>Respond to legal requests and law enforcement</li>
              <li>Maintain records as required by Indian law</li>
            </ul>

            <h2>4. Information Sharing & Disclosure</h2>

            <h3>4.1 With Customers</h3>
            <p>When you accept a job, we share with the customer:</p>
            <ul>
              <li>Your first name and profile photo</li>
              <li>Your verified badge status</li>
              <li>Your ratings and review summary</li>
              <li>Your real-time location during job execution</li>
              <li>Your contact number (only for job-related communication)</li>
            </ul>
            <p><strong>Not Shared:</strong> Full address, date of birth, financial information, identity documents</p>

            <h3>4.2 With Service Providers</h3>
            <p>We work with trusted third-party service providers who process data on our behalf:</p>
            <ul>
              <li><strong>Background Verification Agencies:</strong> Share identity documents for verification</li>
              <li><strong>Payment Processors:</strong> Share bank details for payout processing</li>
              <li><strong>Insurance Providers:</strong> Share basic details for accident insurance coverage</li>
              <li><strong>Technology Providers:</strong> Cloud hosting, analytics, communication platforms</li>
            </ul>
            <p>All third parties are contractually bound to protect your data and use it only for specified purposes.</p>

            <h3>4.3 Legal Disclosures</h3>
            <p>We may disclose your information when required by law or to:</p>
            <ul>
              <li>Comply with court orders, government requests, or legal processes</li>
              <li>Investigate fraud, security threats, or policy violations</li>
              <li>Protect the rights, property, or safety of VisvasaHome, Partners, customers, or the public</li>
              <li>Respond to law enforcement agencies</li>
            </ul>

            <h3>4.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, Partner data may be transferred to the acquiring entity. You will be notified of any such change via email.
            </p>

            <h2>5. Data Security</h2>

            <h3>5.1 Technical Safeguards</h3>
            <ul>
              <li><strong>Encryption:</strong> All sensitive data (IDs, bank details) is encrypted at rest and in transit using industry-standard protocols (AES-256, TLS 1.3)</li>
              <li><strong>Access Controls:</strong> Role-based access ensures only authorized personnel can view Partner data</li>
              <li><strong>Secure Infrastructure:</strong> Data hosted on secure cloud servers with regular security audits</li>
              <li><strong>Monitoring:</strong> 24/7 intrusion detection and automated threat response systems</li>
            </ul>

            <h3>5.2 Organizational Safeguards</h3>
            <ul>
              <li>Employee training on data privacy and security protocols</li>
              <li>Confidentiality agreements with all employees and contractors</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Incident response plan for data breaches</li>
            </ul>

            <h3>5.3 Data Breach Notification</h3>
            <p>
              In the unlikely event of a data breach affecting your personal information, we will notify you via email and in-app notification within 72 hours of discovering the breach, along with steps to protect yourself.
            </p>

            <h2>6. Your Privacy Rights</h2>

            <h3>6.1 Access & Correction</h3>
            <ul>
              <li>View your personal information through the Partner app profile section</li>
              <li>Update contact details, address, and bank information anytime</li>
              <li>Request a copy of all data we hold about you (data portability)</li>
            </ul>

            <h3>6.2 Data Deletion</h3>
            <ul>
              <li>Request deletion of your account and associated data</li>
              <li>We will delete your data within 30 days, except where retention is required by law</li>
              <li>Some information (transaction records, tax documents) must be retained for 7 years as per Indian law</li>
            </ul>

            <h3>6.3 Consent Withdrawal</h3>
            <ul>
              <li>Withdraw consent for marketing communications (opt-out of promotional SMS/emails)</li>
              <li>Disable location tracking when not providing services (note: this may limit job allocation)</li>
              <li>Revoke social media account linkages</li>
            </ul>

            <h3>6.4 Complaint & Grievance</h3>
            <p>If you have privacy concerns, contact our Grievance Officer:</p>
            <ul>
              <li>Email: privacy@visvasahome.com</li>
              <li>Address: Visvasa Pvt. Ltd., Data Protection Officer, Jaipur, Rajasthan</li>
              <li>Response time: Within 7 business days</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>We retain Partner data as follows:</p>
            <ul>
              <li><strong>Active Partners:</strong> Data retained for the duration of your partnership</li>
              <li><strong>Inactive Partners (no jobs for 90 days):</strong> Data retained for 1 year, then archived</li>
              <li><strong>Terminated Accounts:</strong> Data deleted within 30 days, except legal retention requirements</li>
              <li><strong>Financial Records:</strong> Retained for 7 years for tax compliance</li>
              <li><strong>Background Verification:</strong> Retained for 3 years post-termination for legal protection</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              VisvasaHome Partner Platform is not intended for individuals under 18 years of age. We do not knowingly collect information from minors. If we discover that a minor has registered, we will immediately terminate the account and delete all associated data.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your data is primarily stored and processed within India. If we need to transfer data internationally (e.g., to cloud service providers with global infrastructure), we ensure adequate safeguards such as Standard Contractual Clauses and Privacy Shield frameworks.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Material changes will be notified via:
            </p>
            <ul>
              <li>Email to your registered email address</li>
              <li>In-app notification</li>
              <li>Notice on the Partner Portal homepage</li>
            </ul>
            <p>
              Continued use of the Platform after such changes constitutes acceptance of the updated Privacy Policy.
            </p>

            <h2>11. Contact Us</h2>
            <p>For privacy-related questions or to exercise your rights, contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@visvasahome.com</li>
              <li><strong>Phone:</strong> 1800-XXX-XXXX (Mon-Sat, 9 AM - 6 PM)</li>
              <li><strong>Mail:</strong> Data Protection Officer, Visvasa Pvt. Ltd., Jaipur, Rajasthan, India</li>
            </ul>

            <div className="mt-8 p-6 bg-slate-100 rounded-lg border-l-4 border-[#2563EB]">
              <h3 className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-[#2563EB]" />
                Our Commitment to You
              </h3>
              <p className="text-sm mb-0">
                Your privacy and trust are paramount to us. We are committed to protecting your personal information with the highest standards of security and transparency. If you ever have concerns about how your data is handled, please reach out to us immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
