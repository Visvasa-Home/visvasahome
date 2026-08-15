import { ArrowLeft, Users, Heart, Scale, Shield } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerAntiDiscriminationPageProps {
  onBack: () => void;
}

export function PartnerAntiDiscriminationPage({ onBack }: PartnerAntiDiscriminationPageProps) {
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
            <Scale className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h1 className="text-4xl">Anti-Discrimination Policy</h1>
        </div>
        <p className="text-slate-600 mb-8">Effective: June 9, 2026</p>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Scale className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Equality</h3>
              <p className="text-sm text-slate-600">Equal opportunity for all partners regardless of background</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Respect</h3>
              <p className="text-sm text-slate-600">Dignity and respect for every individual</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Protection</h3>
              <p className="text-sm text-slate-600">Zero tolerance for discrimination or harassment</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Policy Statement</h2>
            <p>
              VisvasaHome (Visvasa Pvt. Ltd.) is committed to providing an inclusive, respectful, and discrimination-free environment for all service professional partners, customers, and employees. We believe in equal opportunity and treatment for all individuals regardless of their personal characteristics or background.
            </p>
            <p>
              This Anti-Discrimination Policy applies to all aspects of the partner relationship including recruitment, onboarding, job allocation, performance evaluation, compensation, training opportunities, and termination.
            </p>

            <h2>2. Zero Tolerance Commitment</h2>
            <p>
              VisvasaHome maintains a <strong>zero-tolerance policy</strong> toward discrimination, harassment, or bias of any kind. Any Partner, employee, or customer found engaging in discriminatory behavior will face immediate consequences including account suspension, termination, and potential legal action.
            </p>

            <h2>3. Protected Characteristics</h2>
            <p>VisvasaHome prohibits discrimination based on the following protected characteristics:</p>

            <h3>3.1 Caste & Community</h3>
            <ul>
              <li>No discrimination based on caste, sub-caste, or community identity</li>
              <li>Equal treatment for all Partners regardless of social background</li>
              <li>Zero tolerance for casteist remarks, slurs, or bias</li>
            </ul>

            <h3>3.2 Religion & Belief</h3>
            <ul>
              <li>Respect for all religious beliefs and practices (Hindu, Muslim, Christian, Sikh, Buddhist, Jain, and others)</li>
              <li>Accommodation for religious observances and festivals where operationally feasible</li>
              <li>Prohibition of religious profiling in job allocation</li>
            </ul>

            <h3>3.3 Gender & Gender Identity</h3>
            <ul>
              <li>Equal opportunity for all genders (male, female, transgender, non-binary)</li>
              <li>No gender-based job allocation bias (except where legally mandated for customer comfort, e.g., beauty services)</li>
              <li>Zero tolerance for sexism, misogyny, or gender-based harassment</li>
            </ul>

            <h3>3.4 Sexual Orientation</h3>
            <ul>
              <li>Respect for Partners of all sexual orientations (LGBTQIA+ inclusive)</li>
              <li>Prohibition of homophobic, transphobic, or discriminatory behavior</li>
              <li>Confidentiality and respect for personal identity</li>
            </ul>

            <h3>3.5 Age</h3>
            <ul>
              <li>No age-based discrimination (Partners aged 18-65 are equally valued)</li>
              <li>Younger Partners are not favored over experienced senior professionals</li>
              <li>Respect for both early-career and veteran Partners</li>
            </ul>

            <h3>3.6 Disability & Health Status</h3>
            <ul>
              <li>Reasonable accommodations for Partners with disabilities</li>
              <li>Job allocation based on capability, not assumptions about disability</li>
              <li>No discrimination based on HIV status, medical conditions, or mental health</li>
            </ul>

            <h3>3.7 Marital & Family Status</h3>
            <ul>
              <li>Equal treatment for single, married, divorced, or widowed Partners</li>
              <li>No discrimination based on parental status or family responsibilities</li>
              <li>Support for Partners balancing work and caregiving duties</li>
            </ul>

            <h3>3.8 Geographic Origin & Language</h3>
            <ul>
              <li>Equal opportunity for Partners from all states and regions of India</li>
              <li>No bias based on native language or accent</li>
              <li>Respect for linguistic diversity (support available in Hindi, English, and regional languages)</li>
            </ul>

            <h3>3.9 Economic Background</h3>
            <ul>
              <li>Equal respect for Partners regardless of economic status</li>
              <li>No discrimination based on residential area or housing type</li>
              <li>Focus on skills and professionalism, not socioeconomic background</li>
            </ul>

            <h2>4. Prohibited Conduct</h2>

            <h3>4.1 By Partners</h3>
            <p>Partners are prohibited from:</p>
            <ul>
              <li>Refusing to serve customers based on caste, religion, gender, or any protected characteristic</li>
              <li>Making discriminatory comments, jokes, or slurs toward customers or fellow Partners</li>
              <li>Displaying bias in professional interactions</li>
              <li>Requesting job assignments based on customer's personal characteristics</li>
              <li>Treating customers differently based on their identity</li>
            </ul>

            <h3>4.2 By Customers</h3>
            <p>VisvasaHome will not tolerate customers who:</p>
            <ul>
              <li>Reject Partners based on name, religion, caste, or personal identity</li>
              <li>Make discriminatory remarks or requests</li>
              <li>Treat Partners disrespectfully due to their background</li>
              <li>Request "only Hindu", "only male", or other discriminatory partner preferences</li>
            </ul>
            <p>
              Customer accounts engaging in discrimination will be suspended immediately and permanently banned from the platform.
            </p>

            <h3>4.3 By VisvasaHome Employees</h3>
            <p>VisvasaHome employees must:</p>
            <ul>
              <li>Treat all Partners with equal respect and professionalism</li>
              <li>Allocate jobs based solely on skills, location, and availability — never personal characteristics</li>
              <li>Provide equal access to training, incentives, and advancement opportunities</li>
              <li>Address complaints and issues impartially</li>
            </ul>

            <h2>5. Equal Job Allocation</h2>
            <h3>5.1 Algorithmic Fairness</h3>
            <p>Our job allocation algorithm is designed to ensure:</p>
            <ul>
              <li>Jobs are assigned based on proximity, skills, ratings, and availability</li>
              <li>No bias based on Partner name, religion, caste, or personal identity</li>
              <li>Regular audits to detect and eliminate unintentional algorithmic bias</li>
              <li>Transparent criteria for job allocation accessible to all Partners</li>
            </ul>

            <h3>5.2 Customer Preferences</h3>
            <p>Customers <strong>cannot</strong> request Partners based on:</p>
            <ul>
              <li>Religion (e.g., "only Hindu professional")</li>
              <li>Caste or community</li>
              <li>Age (except for safety-relevant contexts)</li>
              <li>Marital status or family background</li>
            </ul>
            <p>
              Gender preference is allowed only in limited contexts (e.g., beauty services for women) where it relates to customer comfort and safety, not bias.
            </p>

            <h2>6. Accommodations & Inclusivity</h2>

            <h3>6.1 Religious Observances</h3>
            <ul>
              <li>Partners may decline jobs during major religious festivals (Eid, Diwali, Christmas, Pongal, etc.)</li>
              <li>No penalties for observing religious holidays</li>
              <li>Respectful scheduling around prayer times where feasible</li>
            </ul>

            <h3>6.2 Disability Accommodations</h3>
            <ul>
              <li>Modified job requirements for Partners with disabilities where safe and feasible</li>
              <li>Assistive technology support (e.g., screen readers for visually impaired Partners)</li>
              <li>Access to training materials in accessible formats</li>
            </ul>

            <h3>6.3 Language Support</h3>
            <ul>
              <li>Partner app available in multiple Indian languages</li>
              <li>Customer support in Hindi, English, and regional languages</li>
              <li>Training materials in accessible language formats</li>
            </ul>

            <h2>7. Harassment Prevention</h2>

            <h3>7.1 Definition of Harassment</h3>
            <p>Harassment includes:</p>
            <ul>
              <li>Offensive comments about protected characteristics</li>
              <li>Intimidation, bullying, or hostility</li>
              <li>Unwelcome sexual advances or comments</li>
              <li>Deliberate misgendering or deadnaming</li>
              <li>Displaying offensive symbols or imagery</li>
            </ul>

            <h3>7.2 Zero Tolerance</h3>
            <p>Any Partner or customer found engaging in harassment will face:</p>
            <ul>
              <li><strong>First offense:</strong> Immediate suspension and mandatory sensitivity training</li>
              <li><strong>Second offense:</strong> Permanent account termination</li>
              <li><strong>Severe cases (sexual harassment, violence):</strong> Immediate termination + police reporting</li>
            </ul>

            <h2>8. Reporting Discrimination</h2>

            <h3>8.1 How to Report</h3>
            <p>If you experience or witness discrimination, report immediately through:</p>
            <ul>
              <li><strong>Partner App:</strong> "Report Discrimination" button in Help section</li>
              <li><strong>Email:</strong> discrimination@visvasahome.com</li>
              <li><strong>Hotline:</strong> 1800-XXX-YYYY (24/7 confidential support)</li>
              <li><strong>In-person:</strong> Speak with your Partner Relations Manager</li>
            </ul>

            <h3>8.2 Confidentiality</h3>
            <ul>
              <li>All reports are handled with strict confidentiality</li>
              <li>Reporter identity is protected unless disclosure is legally required</li>
              <li>No retaliation against Partners who report discrimination in good faith</li>
            </ul>

            <h3>8.3 Investigation Process</h3>
            <ul>
              <li><strong>Acknowledgment:</strong> Within 24 hours of report</li>
              <li><strong>Initial Review:</strong> Within 3 business days</li>
              <li><strong>Investigation:</strong> Completed within 10 business days</li>
              <li><strong>Action:</strong> Immediate suspension of accused party during investigation; termination if found guilty</li>
              <li><strong>Outcome Communication:</strong> Reporter informed of action taken</li>
            </ul>

            <h2>9. Consequences of Violations</h2>

            <h3>9.1 For Partners</h3>
            <ul>
              <li><strong>Minor violations (insensitive comments):</strong> Warning + mandatory training</li>
              <li><strong>Moderate violations (refusal to serve based on bias):</strong> 30-day suspension + retraining</li>
              <li><strong>Severe violations (hate speech, harassment):</strong> Permanent termination</li>
              <li><strong>Criminal conduct (assault, violence):</strong> Termination + police action</li>
            </ul>

            <h3>9.2 For Customers</h3>
            <ul>
              <li><strong>Discriminatory requests:</strong> Warning and education</li>
              <li><strong>Repeated discrimination:</strong> Permanent account ban</li>
              <li><strong>Harassment or abuse:</strong> Immediate permanent ban + police reporting</li>
            </ul>

            <h3>9.3 For Employees</h3>
            <ul>
              <li>VisvasaHome employees who discriminate face disciplinary action up to and including termination</li>
              <li>Managers failing to address discrimination are held accountable</li>
            </ul>

            <h2>10. Training & Awareness</h2>
            <ul>
              <li>All new Partners receive anti-discrimination training during onboarding</li>
              <li>Annual refresher training for all active Partners</li>
              <li>Educational materials on respecting diversity and inclusion</li>
              <li>Success stories highlighting inclusive practices</li>
            </ul>

            <h2>11. Our Commitment</h2>
            <p>
              VisvasaHome is committed to building an inclusive community where every Partner feels valued, respected, and empowered to succeed regardless of their background. We continuously evaluate our policies and practices to eliminate bias and promote equity.
            </p>

            <h2>12. Legal Compliance</h2>
            <p>
              This policy is designed to comply with and exceed the requirements of:
            </p>
            <ul>
              <li>The Constitution of India (Article 15: Prohibition of discrimination)</li>
              <li>The Equal Remuneration Act, 1976</li>
              <li>The Rights of Persons with Disabilities Act, 2016</li>
              <li>The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013</li>
              <li>Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989</li>
            </ul>

            <h2>13. Contact & Support</h2>
            <p>For discrimination concerns or support:</p>
            <ul>
              <li><strong>Email:</strong> discrimination@visvasahome.com</li>
              <li><strong>Hotline:</strong> 1800-XXX-YYYY (24/7)</li>
              <li><strong>Grievance Officer:</strong> grievance@visvasahome.com</li>
            </ul>

            <div className="mt-8 p-6 bg-gradient-to-br from-[#2563EB]/10 to-[#d95a1e]/10 rounded-lg border-l-4 border-[#2563EB]">
              <h3 className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[#2563EB]" />
                Our Pledge
              </h3>
              <p className="text-sm mb-0">
                Every service professional who partners with VisvasaHome deserves dignity, respect, and equal opportunity. We pledge to create a platform where your skills and professionalism matter — not your name, background, or identity. Together, we're building a more inclusive and equitable future for India's service professionals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
