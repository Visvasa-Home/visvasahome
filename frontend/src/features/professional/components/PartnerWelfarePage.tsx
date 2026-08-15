import { ArrowLeft, Heart, Shield, Stethoscope, GraduationCap, Users, BadgeIndianRupee, HeartHandshake } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

interface PartnerWelfarePageProps {
  onBack: () => void;
}

export function PartnerWelfarePage({ onBack }: PartnerWelfarePageProps) {
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#d95a1e] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-4">Service Professionals Welfare Policy</h1>
          <p className="text-xl text-white/90">Our commitment to your well-being and growth</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-600 mb-8 text-center">Effective: June 9, 2026</p>

        {/* Welfare Pillars */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Stethoscope className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Health & Safety</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BadgeIndianRupee className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Financial Security</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Skills Development</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
              <h3 className="font-semibold text-sm">Community Support</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Policy Statement</h2>
            <p>
              VisvasaHome (Visvasa Pvt. Ltd.) recognizes that service professionals are the backbone of our platform. While Partners are independent contractors, we are deeply committed to their welfare, safety, professional development, and overall well-being.
            </p>
            <p>
              This Service Professionals Welfare Policy outlines the benefits, support systems, and programs we provide to ensure our Partners can build sustainable, dignified livelihoods.
            </p>

            <h2>2. Financial Well-Being</h2>

            <h3>2.1 Fair & Transparent Earnings</h3>
            <ul>
              <li><strong>Transparent Pricing:</strong> All service rates and commission structures are clearly communicated before job acceptance</li>
              <li><strong>Timely Payments:</strong> Weekly payouts every Monday via direct bank transfer (NEFT/IMPS)</li>
              <li><strong>Zero Payment Delays:</strong> Earnings released on schedule with no arbitrary holds</li>
              <li><strong>No Hidden Deductions:</strong> All deductions (platform fee, TDS) clearly itemized in earnings statements</li>
            </ul>

            <h3>2.2 Income Opportunities</h3>
            <ul>
              <li><strong>On-Demand Jobs:</strong> Flexible job assignments based on your availability and skills</li>
              <li><strong>AMC Subscriptions:</strong> Recurring monthly income from Annual Maintenance Contract customers</li>
              <li><strong>Performance Bonuses:</strong> High-rated Partners (4.7+) receive monthly performance incentives (₹500-₹5,000)</li>
              <li><strong>Referral Rewards:</strong> Earn ₹2,000 for each new Partner you refer who completes 10 jobs</li>
              <li><strong>Peak Hour Bonuses:</strong> Surge pricing during high-demand periods (Partners earn 1.5x during festivals/emergencies)</li>
            </ul>

            <h3>2.3 Financial Assistance Programs</h3>
            <ul>
              <li><strong>Emergency Advance:</strong> Access up to ₹5,000 advance on pending earnings during personal emergencies (interest-free, repaid over 4 weeks)</li>
              <li><strong>Tools & Equipment Financing:</strong> Low-interest loans (8% p.a.) to purchase professional tools and equipment</li>
              <li><strong>Medical Emergency Fund:</strong> One-time financial assistance up to ₹25,000 for critical medical situations (case-by-case evaluation)</li>
            </ul>

            <h2>3. Health & Safety</h2>

            <h3>3.1 Accident Insurance</h3>
            <p><strong>Coverage Details:</strong></p>
            <ul>
              <li><strong>Eligibility:</strong> Active Partners completing minimum 10 jobs/month</li>
              <li><strong>Coverage:</strong> Up to ₹5 lakhs for accidental death or permanent disability</li>
              <li><strong>Scope:</strong> Covers accidents occurring during job execution and commute to/from customer locations</li>
              <li><strong>Premium:</strong> Fully paid by VisvasaHome at no cost to Partners</li>
              <li><strong>Claim Process:</strong> Submit claim within 30 days; processed within 15 business days</li>
            </ul>

            <p><strong>How to Claim:</strong></p>
            <ul>
              <li>Report incident immediately via Partner app or helpline</li>
              <li>Provide FIR copy (for accidents), medical records, and hospitalization bills</li>
              <li>Dedicated insurance support team assists with claim filing</li>
              <li>Nominee receives payout directly in case of death/disability</li>
            </ul>

            <h3>3.2 Health & Wellness Benefits</h3>
            <ul>
              <li><strong>Free Annual Health Checkup:</strong> Partners completing 500+ jobs/year eligible for full-body health screening at partner hospitals</li>
              <li><strong>Telemedicine Access:</strong> Free 24/7 teleconsultation with doctors via partner healthcare app</li>
              <li><strong>Subsidized Medicines:</strong> 20% discount at partner pharmacy chains on prescription medicines</li>
              <li><strong>Mental Health Support:</strong> Free counseling sessions through partner mental health providers (confidential, 3 sessions/year)</li>
            </ul>

            <h3>3.3 Safety Training & Equipment</h3>
            <ul>
              <li><strong>Safety Protocols Training:</strong> Mandatory training on electrical safety, height work, chemical handling, etc.</li>
              <li><strong>Personal Protective Equipment (PPE):</strong> Subsidized safety gear (gloves, masks, safety shoes) available through partner procurement portal</li>
              <li><strong>COVID-19 Precautions:</strong> Free masks, sanitizers, and hygiene kits during health crises</li>
              <li><strong>SOS Feature:</strong> In-app emergency button connects to 24/7 support and shares real-time location with family/emergency contacts</li>
            </ul>

            <h2>4. Professional Development</h2>

            <h3>4.1 Free Training Programs</h3>
            <ul>
              <li><strong>Onboarding Training:</strong> 2-day comprehensive training on platform usage, customer service, safety protocols</li>
              <li><strong>Skill Enhancement Workshops:</strong> Monthly workshops on advanced techniques, new technologies, troubleshooting</li>
              <li><strong>Soft Skills Training:</strong> Communication, customer handling, conflict resolution, time management</li>
              <li><strong>Digital Literacy:</strong> Smartphone usage, online payments, digital documentation</li>
              <li><strong>Language Classes:</strong> Basic English and regional language classes for better customer communication</li>
            </ul>

            <h3>4.2 Certifications & Licensing Support</h3>
            <ul>
              <li><strong>Industry Certifications:</strong> Financial support (50% subsidy) for recognized certifications (e.g., AC technician, electrician licenses)</li>
              <li><strong>Government License Assistance:</strong> Guidance and documentation support for obtaining trade licenses</li>
              <li><strong>VisvasaHome Verified Badge:</strong> Digital badge on profile after completing skill assessments and quality standards</li>
            </ul>

            <h3>4.3 Career Progression</h3>
            <ul>
              <li><strong>Bronze → Silver → Gold → Platinum Tiers:</strong> Partners promoted based on ratings, job count, and tenure</li>
              <li><strong>Tier Benefits:</strong> Higher commissions, priority job allocation, exclusive training, recognition awards</li>
              <li><strong>Lead Partner Program:</strong> High-performing Partners can become team leads, mentoring new Partners and earning leadership bonuses</li>
            </ul>

            <h2>5. Family & Social Support</h2>

            <h3>5.1 Family Benefits</h3>
            <ul>
              <li><strong>Spouse Employment Support:</strong> Priority registration and onboarding for Partners' family members with relevant skills</li>
              <li><strong>Children's Education Support:</strong> Annual scholarships (₹5,000-₹25,000) for top-performing Partners' children based on academic merit</li>
              <li><strong>Family Emergency Leave:</strong> Compassionate leave without penalty during family medical emergencies</li>
            </ul>

            <h3>5.2 Life Events Support</h3>
            <ul>
              <li><strong>Marriage/Child Birth:</strong> ₹5,000 one-time gift for long-term Partners (2+ years with VisvasaHome)</li>
              <li><strong>Bereavement Support:</strong> ₹10,000 financial assistance in case of immediate family member's death</li>
              <li><strong>Festival Bonuses:</strong> Special bonuses during Diwali, Eid, Christmas based on yearly performance (₹1,000-₹10,000)</li>
            </ul>

            <h3>5.3 Community Building</h3>
            <ul>
              <li><strong>Partner Meetups:</strong> Quarterly regional meetups for networking, knowledge sharing, and celebration</li>
              <li><strong>Recognition & Awards:</strong> Annual awards ceremony honoring top performers, longest-serving Partners, customer favorites</li>
              <li><strong>Partner Forum:</strong> Online community where Partners can connect, share experiences, ask questions, and support each other</li>
              <li><strong>Cultural Events:</strong> Festival celebrations, sports tournaments, family picnics for Partner community engagement</li>
            </ul>

            <h2>6. Work-Life Balance</h2>

            <h3>6.1 Flexible Working</h3>
            <ul>
              <li><strong>Control Your Schedule:</strong> Accept jobs when you want; decline jobs without penalty (acceptance rate doesn't affect tier status)</li>
              <li><strong>Work Area Selection:</strong> Set your preferred service radius (3km, 5km, 10km) to minimize travel time</li>
              <li><strong>Break Mode:</strong> Temporarily disable job notifications for rest periods, family time, or personal commitments</li>
              <li><strong>Weekend & Holiday Flexibility:</strong> Choose whether to accept jobs on weekends/festivals (premium rates apply)</li>
            </ul>

            <h3>6.2 Workload Management</h3>
            <ul>
              <li><strong>Job Limits:</strong> Platform alerts if you're accepting too many jobs in a short period to prevent burnout</li>
              <li><strong>Rest Recommendations:</strong> Suggested rest periods after long work hours (e.g., "You've worked 10 hours today. Consider taking a break.")</li>
              <li><strong>No Forced Availability:</strong> Partners are never penalized for limiting work hours or taking days off</li>
            </ul>

            <h2>7. Grievance Redressal & Support</h2>

            <h3>7.1 Support Channels</h3>
            <ul>
              <li><strong>In-App Support Chat:</strong> Real-time chat with Partner Support team (avg. response time: 5 minutes)</li>
              <li><strong>Phone Support:</strong> Toll-free helpline 1800-XXX-XXXX available 24/7 in Hindi, English, and regional languages</li>
              <li><strong>Partner Relations Manager:</strong> Dedicated relationship manager assigned to each region for personalized support</li>
              <li><strong>Email Support:</strong> partners@visvasahome.com (response within 12 hours)</li>
            </ul>

            <h3>7.2 Complaint Resolution</h3>
            <ul>
              <li><strong>Step 1:</strong> Raise issue via app support (resolved within 24 hours for 85% of cases)</li>
              <li><strong>Step 2:</strong> Escalate to Partner Relations Manager (response within 48 hours)</li>
              <li><strong>Step 3:</strong> Final escalation to Grievance Officer (resolution within 7 days)</li>
            </ul>

            <h3>7.3 Fair Treatment Guarantee</h3>
            <ul>
              <li><strong>No Retaliation:</strong> Partners who raise complaints or provide feedback are never penalized or discriminated against</li>
              <li><strong>Transparent Dispute Resolution:</strong> All payment disputes, customer complaints, and policy violations handled with documented evidence and fair hearings</li>
              <li><strong>Appeal Process:</strong> Partners can appeal account suspensions or penalties within 7 days; reviewed by independent committee</li>
            </ul>

            <h2>8. Legal & Regulatory Support</h2>

            <h3>8.1 Compliance Assistance</h3>
            <ul>
              <li><strong>Tax Support:</strong> Guidance on filing ITR as self-employed professional; annual Form 16A provided for TDS</li>
              <li><strong>GST Registration:</strong> Assistance with GST registration for high-earning Partners (if applicable)</li>
              <li><strong>Licensing Support:</strong> Help navigating trade license requirements and local regulations</li>
            </ul>

            <h3>8.2 Legal Protection</h3>
            <ul>
              <li><strong>Customer Dispute Mediation:</strong> VisvasaHome mediates disputes between Partners and customers to find fair resolutions</li>
              <li><strong>Legal Advisory:</strong> Free basic legal consultation for job-related disputes (1 session with partner lawyers)</li>
              <li><strong>Protection Against False Claims:</strong> Platform reviews all customer complaints with evidence before penalizing Partners</li>
            </ul>

            <h2>9. Special Programs</h2>

            <h3>9.1 Women Partners Empowerment</h3>
            <ul>
              <li><strong>Women-Only Service Requests:</strong> Female Partners get priority for beauty, childcare, and women's health services</li>
              <li><strong>Safe Working Hours:</strong> Optional limitation of late-night jobs (after 8 PM) for women Partners</li>
              <li><strong>Menstrual Leave:</strong> Up to 2 days/month can be marked unavailable without affecting tier status</li>
              <li><strong>Women's Community:</strong> Dedicated support group and mentorship program for women Partners</li>
            </ul>

            <h3>9.2 Senior Partner Program (Age 50+)</h3>
            <ul>
              <li><strong>Lighter Physical Jobs:</strong> Preference for consultation, supervisory, and low-intensity jobs</li>
              <li><strong>Mentorship Roles:</strong> Senior Partners can become trainers and mentors for younger professionals</li>
              <li><strong>Health Priority:</strong> Enhanced health checkup frequency (twice/year vs. annual)</li>
            </ul>

            <h3>9.3 Partner Upskilling Fund</h3>
            <ul>
              <li>Annual budget of ₹5 crores for Partner training, certifications, and education</li>
              <li>Covers advanced technical courses, management training, entrepreneurship workshops</li>
              <li>Goal: Help Partners transition from service providers to business owners</li>
            </ul>

            <h2>10. Crisis Support</h2>

            <h3>10.1 Pandemic & Health Crises</h3>
            <ul>
              <li><strong>Income Protection:</strong> During widespread lockdowns, Partners receive minimum income support (₹5,000-₹10,000/month based on tier)</li>
              <li><strong>Health Support:</strong> Free COVID testing, vaccination drives, hospitalization support during pandemics</li>
              <li><strong>Essential Service Bonuses:</strong> Partners providing emergency services during crises receive hazard pay (2x rates)</li>
            </ul>

            <h3>10.2 Natural Disasters & Emergencies</h3>
            <ul>
              <li><strong>Emergency Relief Fund:</strong> Immediate financial assistance (₹10,000-₹50,000) for Partners affected by natural disasters</li>
              <li><strong>Temporary Housing:</strong> Coordination with relief organizations for shelter and basic necessities</li>
              <li><strong>Livelihood Restoration:</strong> Fast-tracked job allocation and tool replacement assistance post-disaster</li>
            </ul>

            <h2>11. Partner Feedback & Co-Creation</h2>

            <h3>11.1 Voice & Representation</h3>
            <ul>
              <li><strong>Partner Council:</strong> Elected representatives from each region meet quarterly with VisvasaHome leadership to voice concerns and suggest improvements</li>
              <li><strong>Surveys & Feedback:</strong> Regular surveys on Partner satisfaction, challenges, and suggestions (anonymous)</li>
              <li><strong>Policy Input:</strong> Major policy changes are shared with Partner Council for feedback before implementation</li>
            </ul>

            <h3>11.2 Continuous Improvement</h3>
            <ul>
              <li>This Welfare Policy is reviewed annually based on Partner feedback and evolving needs</li>
              <li>New benefits and programs introduced based on community requests</li>
              <li>Transparency reports published annually on welfare spending and impact</li>
            </ul>

            <h2>12. Our Commitment</h2>
            <p>
              VisvasaHome pledges to allocate a minimum of 5% of annual revenue to Partner welfare programs. This includes insurance premiums, training programs, financial assistance, health benefits, and community initiatives.
            </p>
            <p>
              We believe that when our Partners thrive, our customers benefit, and our business grows. Your welfare is not an expense — it's an investment in our shared future.
            </p>

            <h2>13. Contact</h2>
            <p>For welfare-related queries or to access benefits:</p>
            <ul>
              <li><strong>Email:</strong> welfare@visvasahome.com</li>
              <li><strong>Phone:</strong> 1800-XXX-XXXX (24/7)</li>
              <li><strong>In-App:</strong> "Partner Welfare" section in Help menu</li>
            </ul>

            <div className="mt-8 p-6 bg-gradient-to-br from-[#2563EB]/10 to-[#d95a1e]/10 rounded-lg border-l-4 border-[#2563EB]">
              <h3 className="flex items-center gap-2 mb-3">
                <HeartHandshake className="w-5 h-5 text-[#2563EB]" />
                You Are Not Just a Partner — You Are Family
              </h3>
              <p className="text-sm mb-0">
                Every service professional who partners with VisvasaHome deserves respect, security, and opportunities to build a better future. We're committed to standing by you through every stage of your career — from your first job to your professional legacy. Together, we're building more than a platform; we're building a community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
