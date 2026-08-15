import { useState } from 'react';
import {
  ArrowLeft, Plus, Search, Star, MapPin, Clock, CheckCircle, Upload,
  ChevronRight, Hammer, Building2, Layers, Droplets, Sun, Package,
  MessageSquare, Shield, TrendingUp, Award, Filter, ChevronDown,
  IndianRupee, Calendar, Camera, FileText, Eye, ThumbsUp, AlertCircle,
} from 'lucide-react';

interface ContractorHubPageProps {
  onBack: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}

type View = 'home' | 'post-project' | 'browse-contractors' | 'my-projects' | 'project-detail' | 'contractor-profile';

const projectCategories = [
  { icon: Hammer, label: 'Home Renovation', color: 'bg-blue-100 text-blue-600' },
  { icon: Building2, label: 'New Construction', color: 'bg-blue-100 text-[#2563EB]' },
  { icon: Layers, label: 'Interior Design', color: 'bg-purple-100 text-purple-600' },
  { icon: Droplets, label: 'Waterproofing', color: 'bg-teal-100 text-teal-600' },
  { icon: Sun, label: 'Solar Panels', color: 'bg-yellow-100 text-yellow-600' },
  { icon: Package, label: 'Modular Kitchen', color: 'bg-pink-100 text-pink-600' },
  { icon: Layers, label: 'False Ceiling', color: 'bg-indigo-100 text-indigo-600' },
  { icon: Building2, label: 'Flooring & Tiling', color: 'bg-green-100 text-green-600' },
];

const sampleContractors = [
  {
    id: 1,
    name: 'Rajesh Construction Co.',
    category: 'Home Renovation',
    rating: 4.8,
    reviews: 124,
    projects: 89,
    location: 'Jaipur, Rajasthan',
    verified: true,
    badge: 'Top Rated',
    responseTime: '< 2 hrs',
    priceRange: '₹50K – ₹5L',
    specialties: ['Full Home Renovation', 'Bathroom Remodel', 'Kitchen Upgrade'],
    since: '2018',
  },
  {
    id: 2,
    name: 'Sharma Interiors & Build',
    category: 'Interior Design',
    rating: 4.9,
    reviews: 87,
    projects: 62,
    location: 'Delhi, NCR',
    verified: true,
    badge: 'Premium Partner',
    responseTime: '< 4 hrs',
    priceRange: '₹80K – ₹15L',
    specialties: ['Modular Kitchen', 'Wardrobes', '3D Design'],
    since: '2016',
  },
  {
    id: 3,
    name: 'GreenBuild Solutions',
    category: 'Solar & Sustainable',
    rating: 4.7,
    reviews: 55,
    projects: 41,
    location: 'Pune, Maharashtra',
    verified: true,
    badge: 'Eco Expert',
    responseTime: '< 6 hrs',
    priceRange: '₹1.2L – ₹8L',
    specialties: ['Solar Installation', 'Rooftop Panels', 'Grid Connection'],
    since: '2019',
  },
];

const myProjects = [
  {
    id: 'P001',
    title: 'Master Bedroom Renovation',
    category: 'Home Renovation',
    budget: '₹1.5 – 2.5 Lakh',
    status: 'Quotes Received',
    statusColor: 'bg-blue-100 text-[#2563EB]',
    quotes: 4,
    postedDate: '3 days ago',
    milestones: [
      { name: 'Initial Survey', done: true },
      { name: 'Material Procurement', done: true },
      { name: 'Civil Work', done: false },
      { name: 'Painting & Finish', done: false },
      { name: 'Final Inspection', done: false },
    ],
    progress: 40,
    contractor: 'Rajesh Construction Co.',
    amount: '₹1,85,000',
  },
  {
    id: 'P002',
    title: 'Modular Kitchen Installation',
    category: 'Modular Kitchen',
    budget: '₹80K – 1.2 Lakh',
    status: 'In Progress',
    statusColor: 'bg-green-100 text-green-700',
    quotes: 6,
    postedDate: '12 days ago',
    milestones: [
      { name: 'Design Approval', done: true },
      { name: 'Material Order', done: true },
      { name: 'Installation', done: false },
      { name: 'Handover', done: false },
    ],
    progress: 50,
    contractor: 'Sharma Interiors & Build',
    amount: '₹95,000',
  },
];

const quotes = [
  { contractor: 'Rajesh Construction Co.', amount: '₹1,85,000', timeline: '22 days', rating: 4.8, verified: true },
  { contractor: 'Build Pro Services', amount: '₹1,72,000', timeline: '28 days', rating: 4.5, verified: true },
  { contractor: 'Urban Constructors', amount: '₹2,10,000', timeline: '18 days', rating: 4.6, verified: true },
  { contractor: 'Agarwal Home Works', amount: '₹1,65,000', timeline: '30 days', rating: 4.3, verified: false },
];

function StepIndicator({ step, current }: { step: number; current: number }) {
  const done = step < current;
  const active = step === current;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
      ${done ? 'bg-green-500 text-white' : active ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'}`}>
      {done ? <CheckCircle className="w-4 h-4" /> : step}
    </div>
  );
}

function PostProjectFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', category: '', description: '', budgetMin: '', budgetMax: '',
    timeline: '', location: '', photos: [] as string[],
  });

  const steps = ['Project Details', 'Budget & Timeline', 'Location & Photos', 'Review & Post'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Steps */}
      <div className="flex items-center mb-8 gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <StepIndicator step={i + 1} current={step} />
              <span className={`text-xs text-center ${i + 1 === step ? 'text-[#2563EB] font-medium' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 mb-4 ${i + 1 < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-gray-800 mb-1">What project do you need done?</h3>
              <p className="text-sm text-gray-500">Be as specific as possible to get accurate quotes</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Project Title *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                placeholder="e.g. Full bathroom renovation with tiles"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {projectCategories.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setForm(f => ({ ...f, category: c.label }))}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all
                      ${form.category === c.label ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className={`p-1.5 rounded ${c.color}`}><c.icon className="w-4 h-4" /></span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Project Description *</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                placeholder="Describe what work needs to be done, existing condition, preferences, etc."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-gray-800 mb-1">Budget & Timeline</h3>
              <p className="text-sm text-gray-500">Set a realistic budget range to attract the right contractors</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Budget Range (₹)</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Minimum"
                    value={form.budgetMin}
                    onChange={e => setForm(f => ({ ...f, budgetMin: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Maximum"
                    value={form.budgetMax}
                    onChange={e => setForm(f => ({ ...f, budgetMax: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">When do you want to start?</label>
              <div className="grid grid-cols-3 gap-2">
                {['ASAP', 'Within 1 week', '2–4 weeks', '1–2 months', 'Flexible', 'Just planning'].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, timeline: t }))}
                    className={`p-2.5 rounded-lg border text-sm transition-all
                      ${form.timeline === t ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-gray-800 mb-1">Location & Photos</h3>
              <p className="text-sm text-gray-500">Photos help contractors give more accurate quotes</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Service Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Enter your address or use GPS"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Project Photos (optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each (max 10 photos)</p>
                <button className="mt-3 px-4 py-2 bg-blue-50 text-[#2563EB] rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  <Upload className="w-4 h-4 inline mr-1" /> Choose Photos
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-gray-800 mb-1">Review Your Project</h3>
              <p className="text-sm text-gray-500">Verified contractors will submit quotes within 48 hours</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              {[
                ['Project', form.title || 'Master Bedroom Renovation'],
                ['Category', form.category || 'Home Renovation'],
                ['Budget', form.budgetMin ? `₹${form.budgetMin} – ₹${form.budgetMax}` : '₹1,00,000 – ₹2,00,000'],
                ['Start', form.timeline || 'Within 1 week'],
                ['Location', form.location || '12, Gopalbari, Jaipur'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-gray-800 font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
              <Shield className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Escrow Protection</p>
                <p className="text-xs text-[#2563EB] mt-0.5">Payments are held securely and released only on your approval at each milestone.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => step < 4 ? setStep(s => s + 1) : onBack()}
            className="flex-1 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#2563EB] transition-colors"
          >
            {step < 4 ? 'Continue' : 'Post Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MilestoneTracker({ project }: { project: typeof myProjects[0] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Project Progress</h4>
        <span className="text-sm text-[#2563EB] font-semibold">{project.progress}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div className="bg-[#2563EB] h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="space-y-3">
        {project.milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
              ${m.done ? 'bg-green-100' : 'bg-gray-100'}`}>
              {m.done
                ? <CheckCircle className="w-4 h-4 text-green-600" />
                : <div className="w-2 h-2 rounded-full bg-gray-400" />}
            </div>
            <span className={`text-sm ${m.done ? 'text-gray-800 line-through text-gray-400' : 'text-gray-700'}`}>
              {m.name}
            </span>
            {m.done && <span className="ml-auto text-xs text-green-600 font-medium">Done</span>}
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
        <button className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
          <MessageSquare className="w-4 h-4" /> Chat
        </button>
        <button className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5">
          <ThumbsUp className="w-4 h-4" /> Approve Milestone
        </button>
      </div>
    </div>
  );
}

function QuoteCard({ q }: { q: typeof quotes[0] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-800 text-sm">{q.contractor}</span>
            {q.verified && <Shield className="w-4 h-4 text-[#2563EB]" />}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-600">{q.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#2563EB] font-semibold">{q.amount}</div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Clock className="w-3 h-3" /> {q.timeline}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
          <Eye className="w-3.5 h-3.5" /> View Details
        </button>
        <button className="flex-1 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-medium hover:bg-[#2563EB] transition-colors">
          Accept Quote
        </button>
      </div>
    </div>
  );
}

export function ContractorHubPage({ onBack, isAuthenticated, onLogin }: ContractorHubPageProps) {
  const [view, setView] = useState<View>('home');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  if (view === 'post-project') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-gray-900">Post a Project</h2>
              <p className="text-xs text-gray-500">Get quotes from verified contractors</p>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <PostProjectFlow onBack={() => setView('my-projects')} />
        </div>
      </div>
    );
  }

  if (view === 'my-projects') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-gray-900">My Projects</h2>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-0 flex border-b border-gray-100">
            {(['active', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                  ${activeTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {myProjects.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{p.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{p.category} · Posted {p.postedDate}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{p.budget}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.quotes} quotes</span>
                  {p.contractor && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />{p.contractor}</span>}
                </div>
                {p.status === 'In Progress' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-[#2563EB] h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
              {p.status === 'Quotes Received' && (
                <div className="border-t border-gray-100 p-4 bg-blue-50">
                  <p className="text-xs text-[#2563EB] font-medium mb-3">{p.quotes} contractors submitted quotes</p>
                  <div className="space-y-2">
                    {quotes.slice(0, 2).map((q, i) => <QuoteCard key={i} q={q} />)}
                  </div>
                  <button className="w-full mt-2 text-[#2563EB] text-xs font-medium py-2 hover:underline">
                    View all {p.quotes} quotes
                  </button>
                </div>
              )}
              {p.status === 'In Progress' && (
                <div className="border-t border-gray-100 p-4">
                  <MilestoneTracker project={p} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'browse-contractors') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none" placeholder="Search contractors..." />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {sampleContractors.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800 truncate">{c.name}</h4>
                    {c.verified && <Shield className="w-4 h-4 text-[#2563EB] flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-700">{c.rating}</span>
                    <span className="text-xs text-gray-400">({c.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> {c.location}
                  </div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-full h-fit">{c.badge}</span>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span><strong className="text-gray-700">{c.projects}</strong> projects</span>
                <span><strong className="text-gray-700">{c.responseTime}</strong> response</span>
                <span><strong className="text-gray-700">{c.priceRange}</strong></span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.specialties.map(s => (
                  <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                  <Eye className="w-4 h-4" /> View Portfolio
                </button>
                <button className="flex-1 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors">
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-gray-900">Contractor Hub</h2>
              <p className="text-xs text-gray-500">Large projects · Renovation · Construction</p>
            </div>
          </div>
          <button
            onClick={() => setView('my-projects')}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" /> My Projects
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#1D4ED8] to-blue-900 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-64 h-64 bg-white rounded-full absolute -top-20 -right-20" />
            <div className="w-40 h-40 bg-white rounded-full absolute -bottom-10 -left-10" />
          </div>
          <div className="relative z-10">
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3">
              1,200+ Verified Contractors
            </div>
            <h2 className="text-white mb-2">Plan Your Next Big Project</h2>
            <p className="text-blue-200 text-sm mb-6 max-w-md">
              Post your requirement once. Get multiple verified quotes. Compare and hire with escrow-protected payments.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => isAuthenticated ? setView('post-project') : onLogin()}
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#2563EB] rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Post a Project
              </button>
              <button
                onClick={() => setView('browse-contractors')}
                className="flex items-center gap-2 px-5 py-3 bg-[#2563EB]/50 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-[#2563EB] transition-colors"
              >
                <Search className="w-4 h-4" /> Browse Contractors
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h3 className="text-gray-800 mb-4">How Contractor Hub Works</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: '1', label: 'Post Requirement', desc: 'Describe project with photos & budget', icon: FileText },
              { n: '2', label: 'Get Quotes', desc: 'Verified contractors bid within 48 hrs', icon: MessageSquare },
              { n: '3', label: 'Compare & Hire', desc: 'Compare portfolios, ratings & prices', icon: TrendingUp },
              { n: '4', label: 'Track & Pay', desc: 'Milestone tracker with escrow safety', icon: Shield },
            ].map(step => (
              <div key={step.n} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <step.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="text-xs font-bold text-[#2563EB] mb-1">Step {step.n}</div>
                <div className="text-sm font-semibold text-gray-800 mb-1">{step.label}</div>
                <div className="text-xs text-gray-500">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Browse by Category</h3>
            <button className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
              All categories <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {projectCategories.map(c => (
              <button
                key={c.label}
                onClick={() => setView('browse-contractors')}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-all hover:border-blue-200 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform ${c.color}`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-gray-700">{c.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, title: 'Escrow Protection', desc: 'Your payment is held safely and released only after milestone approval.' },
            { icon: Award, title: 'Verified Contractors', desc: 'Background-checked, licensed, and rated by real customers.' },
            { icon: AlertCircle, title: 'Dispute Resolution', desc: 'Platform arbitration available if any issue arises during the project.' },
          ].map(t => (
            <div key={t.title} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <t.icon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800 mb-1">{t.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Contractors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Top Rated Contractors</h3>
            <button onClick={() => setView('browse-contractors')} className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleContractors.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{c.name}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-600">{c.rating} · {c.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {c.location}
                </div>
                <button
                  onClick={() => isAuthenticated ? setView('post-project') : onLogin()}
                  className="w-full py-2 bg-blue-50 text-[#2563EB] rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
