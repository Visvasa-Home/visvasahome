import { useState } from 'react';
import { ArrowLeft, Clock, Tag, ArrowRight, Wrench, Zap, Droplets, Wind, Sparkles, HardHat } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface BlogPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const categories = ['All', 'Home Maintenance', 'Electrical', 'Plumbing', 'Cleaning', 'AC & Appliances', 'Pest Control', 'Safety Tips'];

const articles = [
  {
    id: 1,
    title: '10 Home Maintenance Tasks Every Homeowner Should Do Every Year',
    category: 'Home Maintenance',
    readTime: '6 min read',
    date: 'April 2025',
    icon: Wrench,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-blue-50',
    excerpt: 'Preventive home maintenance isn\'t just about comfort — it\'s about protecting your investment. Here are 10 essential checks and tasks every homeowner should schedule annually to avoid costly repairs.',
    content: [
      { heading: '1. Inspect Your Roof and Gutters', body: 'Check for missing or damaged tiles, blocked gutters, and early signs of water seepage. Post-monsoon inspection is especially important in India. Clear debris from gutters and check downspouts flow properly.' },
      { heading: '2. Service Your Air Conditioners', body: 'Before summer begins, have all AC units serviced. Clean or replace filters, check refrigerant levels, inspect drainage pipes, and test all settings. A serviced AC uses up to 15% less electricity.' },
      { heading: '3. Check All Electrical Panels and MCBs', body: 'Annual inspection of your electrical panel, MCBs, and wiring can prevent fires and save lives. Look for tripped breakers, scorched marks, or buzzing sounds — call a licensed electrician immediately if you notice any.' },
      { heading: '4. Inspect Plumbing for Leaks', body: 'Even a slow drip wastes thousands of litres of water per year. Inspect all visible pipes, faucets, toilet cisterns, and under-sink connections. Check water pressure and look for rust stains indicating pipe corrosion.' },
      { heading: '5. Deep Clean Water Tanks and Overhead Tanks', body: 'Water tanks accumulate sediment and bacteria over time. Schedule a professional water tank cleaning once a year, especially if your home relies on overhead storage tanks for daily water supply.' },
      { heading: '6. Check and Treat for Termites', body: 'Termites cause structural damage that isn\'t covered by most home insurance. Annual termite inspection and preventive treatment, especially in wooden furniture, frames, and false ceilings, is essential.' },
      { heading: '7. Service Geysers and Water Heaters', body: 'Flush the tank to remove sediment, check the anode rod, inspect all connections, and test pressure relief valves. A poorly maintained geyser is both dangerous and inefficient.' },
      { heading: '8. Repaint or Touch Up Exterior Walls', body: 'Peeling exterior paint exposes walls to moisture and structural damage. Check for cracks, apply waterproofing where needed, and touch up or repaint every 3-5 years to maintain weather protection.' },
      { heading: '9. Lubricate Door Hinges, Locks, and Windows', body: 'Squeaking doors, stiff locks, and sticky windows are signs of neglect. A simple annual lubrication prevents premature wear and keeps your home\'s moving parts functioning smoothly.' },
      { heading: '10. Test Smoke and Gas Detectors', body: 'Replace batteries in all smoke detectors and gas sensors annually. Test each one to ensure they\'re working. If you don\'t have these installed, it\'s the most important safety investment you can make.' },
    ],
    tags: ['annual maintenance', 'home care', 'preventive maintenance'],
  },
  {
    id: 2,
    title: 'How to Know When Your Home Wiring Needs Replacement',
    category: 'Electrical',
    readTime: '5 min read',
    date: 'March 2025',
    icon: Zap,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
    excerpt: 'Outdated or damaged electrical wiring is one of the leading causes of home fires in India. Learn the key warning signs that indicate your home\'s wiring needs professional inspection or full replacement.',
    content: [
      { heading: 'Warning Sign 1: Flickering or Dimming Lights', body: 'If lights flicker or dim when you use multiple appliances simultaneously, your wiring may not be able to handle the load. This is especially common in homes with wiring older than 20 years.' },
      { heading: 'Warning Sign 2: Frequent Breaker Trips', body: 'Occasionally tripping a circuit breaker is normal. But if the same breaker trips repeatedly, it\'s a sign of overloaded circuits or a fault in the wiring that needs immediate professional attention.' },
      { heading: 'Warning Sign 3: Burning Smell or Scorch Marks', body: 'A persistent burning smell near outlets, switches, or the electrical panel is a serious fire hazard. Switch off power to that area and call a licensed electrician immediately.' },
      { heading: 'Warning Sign 4: Outlets Feel Warm', body: 'Wall outlets and switches should never feel warm to the touch during normal use. Warmth indicates a wiring fault, an overloaded circuit, or a failing outlet that can cause fire.' },
      { heading: 'Warning Sign 5: Two-Prong Outlets (No Earthing)', body: 'Older homes with two-prong, non-earthed outlets lack protection from electrical surges. Upgrading to earthed three-prong outlets and proper grounding is essential for modern appliances.' },
      { heading: 'When to Call a Professional', body: 'Any of the above signs warrant an immediate inspection by a certified electrician. VisvasaHome connects you with licensed electrical contractors who provide detailed assessments and transparent repair quotes.' },
    ],
    tags: ['electrical safety', 'home wiring', 'electrician'],
  },
  {
    id: 3,
    title: 'The Complete Guide to Preventing Plumbing Emergencies at Home',
    category: 'Plumbing',
    readTime: '7 min read',
    date: 'March 2025',
    icon: Droplets,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-blue-50',
    excerpt: 'A burst pipe or blocked drain can cause thousands in damage if not addressed in time. Here\'s a comprehensive guide to maintaining your home\'s plumbing system and avoiding costly emergency repairs.',
    content: [
      { heading: 'Never Ignore Slow Drains', body: 'A slowly draining sink or bathtub is an early warning sign of a blockage building up in your pipes. Treat it early with enzymatic cleaners or professional drain cleaning rather than waiting for a full blockage.' },
      { heading: 'Know Your Main Water Shutoff Location', body: 'In any plumbing emergency, the first step is shutting off water supply. Every household member should know where the main shutoff valve is located. In apartments, locate the building shutoff as well.' },
      { heading: 'Check for Hidden Leaks Monthly', body: 'Take your water meter reading, don\'t use any water for 2 hours, then re-check. If the reading has changed, you have a hidden leak somewhere. Common locations include under-sink pipes, cisterns, and outdoor taps.' },
      { heading: 'Protect Pipes from Pressure Damage', body: 'High water pressure (above 80 PSI) causes pipe stress and accelerated wear. Install a pressure reducing valve if needed. A licensed plumber can measure your water pressure and recommend solutions.' },
      { heading: 'Clean Your Showerheads and Aerators', body: 'Mineral deposits clog showerheads and tap aerators, reducing water flow and pressure. Soak them in white vinegar monthly or replace annually to maintain optimal flow.' },
      { heading: 'Schedule Annual Plumbing Inspections', body: 'A comprehensive annual plumbing inspection by a verified professional can identify potential issues before they become expensive emergencies. VisvasaHome\'s plumbing contractors provide detailed written inspection reports.' },
    ],
    tags: ['plumbing tips', 'water leaks', 'pipe maintenance'],
  },
  {
    id: 4,
    title: 'AC Maintenance Before Summer: A Step-by-Step Checklist',
    category: 'AC & Appliances',
    readTime: '5 min read',
    date: 'February 2025',
    icon: Wind,
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
    excerpt: 'Preparing your air conditioner before the summer heat arrives can save you from breakdowns, high electricity bills, and discomfort during peak usage months. Here\'s exactly what needs to be checked.',
    content: [
      { heading: 'Step 1: Clean or Replace the Air Filter', body: 'Dirty filters reduce airflow and make the AC work harder, increasing energy consumption by up to 15%. Clean washable filters monthly and replace disposable filters every 1-3 months during heavy use.' },
      { heading: 'Step 2: Inspect and Clean the Condenser Coils', body: 'The outdoor unit\'s condenser coils collect dirt and debris over months of non-use. Clean them carefully with a soft brush or have a technician clean them professionally before the season starts.' },
      { heading: 'Step 3: Check Refrigerant Levels', body: 'Low refrigerant (gas) is the most common reason ACs don\'t cool effectively. This needs to be checked and refilled by a certified technician. Never attempt to handle refrigerant yourself.' },
      { heading: 'Step 4: Test Drainage and Clean the Drain Pan', body: 'Blocked drain pipes cause water to drip from the indoor unit. Flush the drain pipe with a diluted bleach solution and ensure the drain pan is clean and properly angled.' },
      { heading: 'Step 5: Check Electrical Connections', body: 'Loose connections cause AC failures and can be dangerous. A technician should inspect all electrical connections, capacitors, and contactors before summer use.' },
      { heading: 'Step 6: Test Run in Cooling Mode', body: 'Run each AC unit in cooling mode for 30 minutes before summer begins. Monitor if it reaches the set temperature, listen for unusual sounds, and check if the outdoor fan spins freely.' },
    ],
    tags: ['AC service', 'summer preparation', 'HVAC maintenance'],
  },
  {
    id: 5,
    title: 'Deep Cleaning Your Home: Why Once a Year Isn\'t Enough',
    category: 'Cleaning',
    readTime: '4 min read',
    date: 'January 2025',
    icon: Sparkles,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    excerpt: 'Regular cleaning maintains hygiene, but deep cleaning is about what you can\'t see — bacteria in carpets, mold in bathroom grout, dust mites in mattresses, and grease buildup in kitchen exhausts.',
    content: [
      { heading: 'The Hidden Dirt Problem', body: 'Studies show that a typical home accumulates up to 40 lbs of dust per year. Much of this settles in areas that regular cleaning misses: behind appliances, inside ventilation ducts, under heavy furniture, and inside mattresses.' },
      { heading: 'Kitchen Deep Clean Essentials', body: 'Kitchen exhausts and chimneys accumulate grease that becomes a fire hazard over time. Professional kitchen deep cleaning includes degreasing chimney filters, cleaning behind the refrigerator, scrubbing tile grout, and sanitizing all surfaces.' },
      { heading: 'Bathroom Deep Clean: Beyond Surface Level', body: 'Bathroom grout harbors mold that regular surface cleaning can\'t remove. Professional deep cleaning uses specialized products to remove black mold from grout, descale showerheads, clean toilet cisterns internally, and sanitize all surfaces.' },
      { heading: 'Sofa and Upholstery Cleaning', body: 'Your sofa is home to thousands of dust mites, pet dander, and allergens. Professional steam cleaning or dry-cleaning restores the fabric and eliminates allergens that cause respiratory issues — especially important for homes with children.' },
      { heading: 'Recommended Deep Clean Schedule', body: 'Full home deep clean: twice a year. Kitchen: quarterly. Bathrooms: quarterly. Sofa and upholstery: twice a year. Carpets and mattresses: annually. Water tank: once a year.' },
    ],
    tags: ['deep cleaning', 'home hygiene', 'professional cleaning'],
  },
  {
    id: 6,
    title: 'Signs of Termite Infestation and How to Respond',
    category: 'Pest Control',
    readTime: '5 min read',
    date: 'December 2024',
    icon: HardHat,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    excerpt: 'Termites cause more structural damage to Indian homes than any other pest, often invisibly until it\'s too late. Learn to identify the early warning signs and understand what a professional treatment involves.',
    content: [
      { heading: 'Warning Sign 1: Mud Tubes on Walls', body: 'Subterranean termites build mud tubes (small tunnels about the width of a pencil) along walls, foundations, and wooden beams to travel between their colony and their food source. Spotting these is a clear sign of active termite activity.' },
      { heading: 'Warning Sign 2: Hollow-Sounding Wood', body: 'Tap on wooden frames, flooring, and furniture. If it sounds hollow, termites may have eaten the interior wood while leaving the outer surface intact. This is especially common in wooden door frames and false ceilings.' },
      { heading: 'Warning Sign 3: Discarded Wings', body: 'During swarming season, termites shed their wings. Finding small, translucent wings near windows, doors, or light sources indicates a termite colony is active in or near your home.' },
      { heading: 'Professional Treatment Options', body: 'Soil treatment creates a chemical barrier preventing subterranean termites from entering. Wood treatment protects furniture and wooden structures. Baiting systems use slow-acting poison that termites carry back to the colony.' },
      { heading: 'Prevention is Cheaper than Treatment', body: 'Annual preventive termite treatment costs significantly less than repairing termite damage. VisvasaHome\'s pest control contractors offer eco-friendly preventive treatments with 6-month guarantees.' },
    ],
    tags: ['pest control', 'termite treatment', 'home protection'],
  },
];

function ArticleModal({ article, onClose, onBook }: { article: typeof articles[0]; onClose: () => void; onBook: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
        <div className="p-8">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${article.iconBg} rounded-lg flex items-center justify-center`}>
              <article.icon className={`w-5 h-5 ${article.iconColor}`} />
            </div>
            <div>
              <span className="text-sm text-[#2563EB] font-medium">{article.category}</span>
              <p className="text-xs text-gray-500">{article.date} · {article.readTime}</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{article.excerpt}</p>

          <div className="space-y-6">
            {article.content.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.heading}</h3>
                <p className="text-gray-700 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Need professional help?</h4>
            <p className="text-sm text-gray-600 mb-4">VisvasaHome connects you with verified {article.category} professionals in your city. All contractors are background-checked and quality-monitored.</p>
            <button
              onClick={onBook}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2"
            >
              Book a Professional
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogPage({ onBack, onNavigate }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  const filtered = activeCategory === 'All' ? articles : articles.filter((a) => a.category === activeCategory);

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

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onBook={() => { setSelectedArticle(null); onNavigate('get-started-customer'); }}
        />
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="text-sm">Home Maintenance Knowledge Base</span>
            </div>
            <h1 className="text-4xl font-semibold text-white mb-6">Tips, Guides & Home Care Insights</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Expert-written articles on home maintenance, appliance care, safety, and seasonal upkeep — helping you make informed decisions about your home and your service providers.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${article.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <article.icon className={`w-5 h-5 ${article.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-[#2563EB]">{article.category}</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{article.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{article.excerpt}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                      <span>{article.date}</span>
                    </div>
                    <span className="text-[#2563EB] text-sm flex items-center gap-1 font-medium">
                      Read
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No articles in this category yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Take Action on Your Home?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Knowledge is the first step. The second is connecting with a verified professional who can get the job done right. Book a service today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate('get-started-customer')} className="px-8 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
              Book a Professional
            </button>
            <button onClick={() => onNavigate('amc-home')} className="px-8 py-3 border border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors">
              Explore Home AMC Plans
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
