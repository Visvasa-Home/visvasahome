import { ArrowLeft, Shield, Lock, Eye, Server, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerInfoSecurityPageProps {
  onBack: () => void;
}

export function PartnerInfoSecurityPage({ onBack }: PartnerInfoSecurityPageProps) {
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
            <Shield className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h1 className="text-4xl">Information Security Policy</h1>
        </div>
        <p className="text-slate-600 mb-8">Effective: June 9, 2026</p>

        {/* Security Pillars */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Encryption</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Access Control</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Server className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Secure Infrastructure</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Threat Detection</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Policy Overview</h2>
            <p>
              This Information Security Policy outlines VisvasaHome's commitment to protecting the confidentiality, integrity, and availability of Partner and customer data. This policy applies to all Partners, employees, contractors, and third parties with access to VisvasaHome's systems and data.
            </p>

            <h2>2. Data Protection Principles</h2>
            <h3>2.1 Confidentiality</h3>
            <ul>
              <li>Access to sensitive data is restricted to authorized personnel only</li>
              <li>Data is encrypted both in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>Customer and Partner personal information is never shared without consent (except as legally required)</li>
            </ul>

            <h3>2.2 Integrity</h3>
            <ul>
              <li>Data accuracy is maintained through validation checks and audit trails</li>
              <li>Unauthorized modifications are prevented through access controls</li>
              <li>Regular backups ensure data can be restored in case of corruption</li>
            </ul>

            <h3>2.3 Availability</h3>
            <ul>
              <li>Platform uptime target: 99.5% (excluding planned maintenance)</li>
              <li>Redundant systems ensure continuity in case of failures</li>
              <li>24/7 monitoring and incident response team</li>
            </ul>

            <h2>3. Partner Responsibilities</h2>

            <h3>3.1 Account Security</h3>
            <p><strong>Password Requirements:</strong></p>
            <ul>
              <li>Minimum 8 characters with uppercase, lowercase, number, and special character</li>
              <li>Never share your password with anyone, including VisvasaHome employees</li>
              <li>Change password immediately if you suspect compromise</li>
              <li>Enable two-factor authentication (2FA) for enhanced security</li>
            </ul>

            <p><strong>Login Security:</strong></p>
            <ul>
              <li>Always log out after using the Partner app on shared devices</li>
              <li>Do not allow others to use your Partner account</li>
              <li>Report suspicious login attempts immediately</li>
            </ul>

            <h3>3.2 Device Security</h3>
            <p><strong>Mobile Device Protection:</strong></p>
            <ul>
              <li>Keep your device password/PIN protected</li>
              <li>Install security updates and app updates promptly</li>
              <li>Do not root/jailbreak your device (may compromise security)</li>
              <li>Use official app stores only (Google Play Store / Apple App Store)</li>
              <li>Enable "Find My Device" in case of theft or loss</li>
            </ul>

            <p><strong>Lost or Stolen Device:</strong></p>
            <ul>
              <li>Report to VisvasaHome immediately via helpline: 1800-XXX-XXXX</li>
              <li>We will remotely disable your account to prevent unauthorized access</li>
              <li>After device recovery, contact us to reactivate your account</li>
            </ul>

            <h3>3.3 Customer Data Protection</h3>
            <p><strong>Partners Must:</strong></p>
            <ul>
              <li><strong>Never</strong> photograph or screenshot customer personal information (address, phone number, payment details)</li>
              <li><strong>Never</strong> share customer contact details with third parties</li>
              <li><strong>Never</strong> save customer information on personal devices</li>
              <li>Delete any customer data from personal records after job completion</li>
              <li>Access customer data only through the VisvasaHome app (do not store separately)</li>
            </ul>

            <p><strong>Prohibited Actions:</strong></p>
            <ul>
              <li>Using customer phone numbers for personal marketing or communication outside jobs</li>
              <li>Selling or sharing customer data with competitors or third parties</li>
              <li>Accessing customer data unrelated to assigned jobs</li>
            </ul>

            <p><strong>Penalties:</strong> Violation results in immediate account termination and legal action.</p>

            <h3>3.4 Phishing & Fraud Awareness</h3>
            <p><strong>Recognize Phishing Attempts:</strong></p>
            <ul>
              <li>VisvasaHome will <strong>never</strong> ask for your password via SMS, email, or phone call</li>
              <li>We will <strong>never</strong> ask you to transfer money or share OTP codes</li>
              <li>Beware of fake emails or SMS claiming to be from VisvasaHome</li>
              <li>Verify official communication at partners@visvasahome.com</li>
            </ul>

            <p><strong>Red Flags:</strong></p>
            <ul>
              <li>Messages with poor grammar or spelling errors</li>
              <li>Urgency tactics ("your account will be closed", "act now")</li>
              <li>Links to unfamiliar websites or apps</li>
              <li>Requests for sensitive information (password, bank OTP, etc.)</li>
            </ul>

            <p><strong>What to Do:</strong></p>
            <ul>
              <li>Do not click suspicious links or download attachments</li>
              <li>Report suspicious communications to security@visvasahome.com</li>
              <li>Verify authenticity by calling our official helpline</li>
            </ul>

            <h2>4. VisvasaHome Security Measures</h2>

            <h3>4.1 Technical Safeguards</h3>
            <p><strong>Infrastructure Security:</strong></p>
            <ul>
              <li>Data hosted on ISO 27001 certified cloud infrastructure</li>
              <li>End-to-end encryption for all data transmission</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Regular penetration testing and vulnerability assessments</li>
              <li>DDoS protection and firewall systems</li>
            </ul>

            <p><strong>Application Security:</strong></p>
            <ul>
              <li>Secure coding practices following OWASP guidelines</li>
              <li>Regular security audits and code reviews</li>
              <li>Multi-factor authentication for sensitive operations</li>
              <li>Session timeouts to prevent unauthorized access</li>
            </ul>

            <h3>4.2 Access Controls</h3>
            <p><strong>Role-Based Access:</strong></p>
            <ul>
              <li>Employees have access only to data necessary for their role</li>
              <li>Privileged access (admin rights) is tightly controlled and logged</li>
              <li>Regular access reviews to ensure principle of least privilege</li>
            </ul>

            <p><strong>Monitoring & Logging:</strong></p>
            <ul>
              <li>All system access is logged with timestamps and user IDs</li>
              <li>Automated alerts for suspicious activities</li>
              <li>Audit logs retained for 1 year for security investigations</li>
            </ul>

            <h3>4.3 Incident Response</h3>
            <p><strong>Security Incident Plan:</strong></p>
            <ul>
              <li><strong>Detection:</strong> 24/7 automated monitoring and threat intelligence</li>
              <li><strong>Containment:</strong> Immediate isolation of affected systems</li>
              <li><strong>Notification:</strong> Affected Partners notified within 72 hours</li>
              <li><strong>Remediation:</strong> Vulnerabilities patched and systems restored</li>
              <li><strong>Review:</strong> Post-incident analysis to prevent recurrence</li>
            </ul>

            <h2>5. Data Breach Protocol</h2>
            <h3>5.1 Definition</h3>
            <p>
              A data breach is any unauthorized access, disclosure, or loss of Partner or customer personal data.
            </p>

            <h3>5.2 Notification Process</h3>
            <p>In case of a data breach affecting your personal information:</p>
            <ul>
              <li><strong>Within 72 hours:</strong> Email and in-app notification sent to affected Partners</li>
              <li><strong>Information Provided:</strong> Nature of breach, data affected, steps taken, recommended actions</li>
              <li><strong>Support:</strong> Dedicated helpline for breach-related queries</li>
              <li><strong>Regulatory Reporting:</strong> Compliance with Indian data protection laws and reporting to authorities</li>
            </ul>

            <h3>5.3 Partner Actions After Breach</h3>
            <ul>
              <li>Change your VisvasaHome password immediately</li>
              <li>Monitor your bank account for unauthorized transactions</li>
              <li>Enable 2FA if not already active</li>
              <li>Be vigilant for phishing attempts exploiting the breach</li>
            </ul>

            <h2>6. Third-Party Security</h2>
            <h3>6.1 Service Providers</h3>
            <p>
              VisvasaHome works with trusted third-party vendors (cloud hosting, payment processors, analytics). All vendors must:
            </p>
            <ul>
              <li>Sign Data Processing Agreements (DPAs) committing to data protection</li>
              <li>Undergo security assessments before engagement</li>
              <li>Comply with ISO 27001 or equivalent security standards</li>
              <li>Provide evidence of security controls through audits</li>
            </ul>

            <h3>6.2 No Unauthorized Sharing</h3>
            <p>
              VisvasaHome <strong>never</strong> sells Partner or customer data to third parties for marketing purposes.
            </p>

            <h2>7. Compliance & Certifications</h2>
            <h3>7.1 Regulatory Compliance</h3>
            <ul>
              <li>Information Technology Act, 2000 (IT Act) and IT Rules 2011</li>
              <li>Payment Card Industry Data Security Standard (PCI DSS) for payment data</li>
              <li>Reserve Bank of India (RBI) cybersecurity guidelines</li>
            </ul>

            <h3>7.2 Security Certifications</h3>
            <ul>
              <li>ISO 27001: Information Security Management System (in progress)</li>
              <li>SOC 2 Type II: Cloud security compliance (planned for 2026)</li>
              <li>Regular third-party security audits</li>
            </ul>

            <h2>8. Partner Training & Awareness</h2>
            <h3>8.1 Mandatory Training</h3>
            <ul>
              <li>Information security module during onboarding (30 minutes)</li>
              <li>Annual refresher training for all active Partners</li>
              <li>Topics covered: Password security, phishing, customer data protection</li>
            </ul>

            <h3>8.2 Security Tips & Resources</h3>
            <ul>
              <li>In-app security tips and best practices</li>
              <li>Monthly security newsletters</li>
              <li>Video tutorials on recognizing phishing and securing devices</li>
            </ul>

            <h2>9. Reporting Security Issues</h2>
            <h3>9.1 How to Report</h3>
            <p>If you discover a security vulnerability or incident:</p>
            <ul>
              <li><strong>Email:</strong> security@visvasahome.com</li>
              <li><strong>Phone:</strong> 1800-XXX-XXXX (24/7 hotline)</li>
              <li><strong>In-App:</strong> "Report Security Issue" in Help section</li>
            </ul>

            <h3>9.2 Responsible Disclosure</h3>
            <p>
              If you identify a security vulnerability in our systems, we encourage responsible disclosure. Contact us privately rather than publicly disclosing. We offer:
            </p>
            <ul>
              <li>Acknowledgment and appreciation for responsible reporting</li>
              <li>Recognition in our Security Hall of Fame (with your permission)</li>
              <li>Bug bounty rewards for critical vulnerabilities (at our discretion)</li>
            </ul>

            <h2>10. Policy Violations</h2>
            <h3>10.1 Partner Violations</h3>
            <p>Violations of this policy (e.g., sharing customer data, weak security practices) may result in:</p>
            <ul>
              <li><strong>Minor violations:</strong> Warning + mandatory security retraining</li>
              <li><strong>Serious violations (data breach caused by negligence):</strong> Account suspension + financial liability</li>
              <li><strong>Intentional violations (selling data):</strong> Permanent termination + legal action</li>
            </ul>

            <h2>11. Policy Updates</h2>
            <p>
              This Information Security Policy is reviewed annually and updated as needed to address new threats and comply with evolving regulations. Partners will be notified of material changes via email and in-app notification.
            </p>

            <h2>12. Contact</h2>
            <p>For security questions or to report incidents:</p>
            <ul>
              <li><strong>Email:</strong> security@visvasahome.com</li>
              <li><strong>Phone:</strong> 1800-XXX-XXXX (24/7)</li>
              <li><strong>Chief Information Security Officer (CISO):</strong> ciso@visvasahome.com</li>
            </ul>

            <div className="mt-8 p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h3 className="flex items-center gap-2 mb-3 text-red-900">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Security Alert
              </h3>
              <p className="text-sm text-red-900 mb-0">
                <strong>Remember:</strong> VisvasaHome will NEVER ask for your password, OTP, or bank account details via phone, SMS, or email. If you receive such a request, it's a scam. Report it immediately to security@visvasahome.com or call 1800-XXX-XXXX.
              </p>
            </div>

            <div className="mt-6 p-6 bg-[#2563EB]/10 rounded-lg border-l-4 border-[#2563EB]">
              <h3 className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-[#2563EB]" />
                Your Security is Our Priority
              </h3>
              <p className="text-sm mb-0">
                We invest heavily in protecting your data with industry-leading security measures. But security is a shared responsibility — by following these guidelines, you help protect yourself, your customers, and the entire VisvasaHome community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
