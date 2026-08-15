import { ArrowLeft, GraduationCap, CheckCircle, Star, Award, Phone, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';

interface EducationPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    name: 'Home Tutoring (K-12)',
    desc: 'Qualified tutors for Math, Science, English, and coding lessons at your home. Weekly assessments.',
    price: '₹1,500/month',
    time: '3 sessions/week',
    popular: true,
    features: ['Subject matter experts', 'Personalized curriculum', 'Regular progress reports', 'Doubt clearing sessions'],
  },
  {
    name: 'Music Classes (Guitar/Keyboard)',
    desc: 'One-on-one instrumental coaching with certified musicians. Basic to advanced levels.',
    price: '₹1,200/month',
    time: '2 sessions/week',
    popular: true,
    features: ['Acoustic & electronic training', 'Sheet music guides', 'Flexible slot selection', 'Age-appropriate course'],
  },
  {
    name: 'Language Learning (English/French)',
    desc: 'Spoken English, business writing, and foreign language courses for children and adults.',
    price: '₹999/month',
    time: '2 sessions/week',
    popular: false,
    features: ['Native-level trainers', 'Conversational practice', 'Grammar & accent focus', 'Study materials included'],
  },
  {
    name: 'Hobby & Art Workshops',
    desc: 'At-home drawing, painting, origami, and creative craft workshops for kids during vacations.',
    price: '₹499/session',
    time: '1.5 hrs',
    popular: false,
    features: ['All art materials provided', 'Creative skill exercises', 'Fun and interactive flow', 'Certificates of completion'],
  },
];

const highlights = [
  { icon: Award, title: 'Background-Verified Tutors', desc: 'Detailed academic background and reference verification' },
  { icon: Star, title: '4.9/5 Rating', desc: 'Over 5,000+ happy parents and students' },
  { icon: CheckCircle, title: 'Trial Class Available', desc: 'Opt for a paid trial class before regular monthly commitments' },
  { icon: BookOpen, title: 'Personalized Speed', desc: 'Curriculum customized to school boards and child speed' },
];

export function EducationPage({ onBack, onBookNow }: EducationPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
          </button>
          <div className="py-10 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white/15 rounded-2xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Education & Tutors</h1>
                <p className="text-blue-100 text-lg">Verified tutors for academic excellence, music, and foreign languages at home</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Background Verified Educators</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Custom Syllabus Support</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Academic and Creative Options</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Safe At-Home Environment</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={onBookNow} size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 text-base">
                Find a Tutor
              </Button>
              <a href="tel:+919057567160" className="flex items-center gap-2 px-6 py-3 border-2 border-white/40 rounded-xl text-white hover:bg-white/10 transition-colors font-semibold">
                <Phone className="w-4 h-4" /> +91 905 7567 160
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-blue-50/50 border-b border-blue-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <h.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{h.title}</h3>
                <p className="text-gray-500 text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">At-Home Learning Classes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Build strong foundations with verified at-home tutors. Safe learning for kids, structured feedback for parents.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {services.map((s, i) => (
            <Card key={i} className="p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-base text-gray-900 leading-tight">{s.name}</h3>
                {s.popular && <Badge className="bg-blue-600 text-white text-xs flex-shrink-0 ml-2">Popular</Badge>}
              </div>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{s.desc}</p>
              <ul className="space-y-1 mb-4">
                {s.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Monthly Tuition</p>
                  <p className="font-bold text-blue-600 text-lg">{s.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Schedule</p>
                  <p className="text-xs text-gray-700 font-medium">{s.time}</p>
                </div>
              </div>
              <Button onClick={onBookNow} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
                Book Now
              </Button>
            </Card>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-blue-50/50 rounded-3xl p-10 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Match Tutors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Submit Requirements', desc: 'Specify class grade, board, subject, and preferred weekly slots' },
              { step: '2', title: 'Get Profiles matched', desc: 'Receive profile summaries of qualified tutors in your area' },
              { step: '3', title: 'Book a Trial Class', desc: 'Evaluate compatibility with a dedicated trial class at home' },
              { step: '4', title: 'Confirm & Learn', desc: 'Pay weekly or monthly and track academic improvements digitally' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-600 rounded-3xl p-14 text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Begin Learning At Home Today</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Help your child score better and learn new skills from India\'s top verified private tutors.
          </p>
          <Button onClick={onBookNow} size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-12">
            Book Trial Class
          </Button>
        </section>
      </div>
    </div>
  );
}
