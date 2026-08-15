import { Star, ChevronRight, ArrowRight } from 'lucide-react';

interface HomeFeedProps {
  onNavigate?: (page: string) => void;
}

export function HomeFeed({ onNavigate }: HomeFeedProps) {
  return (
    <div className="bg-white pb-24">
      {/* ── In the spotlight ── */}
      <div className="pt-8 pb-4 max-w-7xl mx-auto w-full">
        <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 px-4 mb-4 tracking-tight">In the spotlight</h2>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x hide-scrollbar">
          {/* Spotlight Card 1 */}
          <div className="shrink-0 w-[85%] sm:w-[320px] snap-start relative rounded-xl overflow-hidden bg-black flex aspect-[2/1] sm:aspect-[16/9]">
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Native</span>
              <h3 className="text-white text-lg sm:text-xl font-bold leading-tight mb-1">RO Water Purifier</h3>
              <p className="text-gray-400 text-xs mb-4">Leaves no service for 2 years</p>
              <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 px-4 rounded w-fit transition-colors border border-white/20">
                Buy now
              </button>
            </div>
            <div className="w-[40%] bg-[#1a1a1a] flex items-center justify-center p-2">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80" alt="RO" className="w-full h-auto object-contain mix-blend-screen" />
            </div>
          </div>

          {/* Spotlight Card 2 */}
          <div className="shrink-0 w-[85%] sm:w-[320px] snap-start relative rounded-xl overflow-hidden bg-[#a67a5b] flex aspect-[2/1] sm:aspect-[16/9]">
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-2">New Launch</span>
              <h3 className="text-white text-lg sm:text-xl font-bold leading-tight mb-4">Luxury facials by<br/>Forest Essentials</h3>
              <button className="bg-white text-[#a67a5b] text-xs font-bold py-1.5 px-4 rounded w-fit transition-colors shadow-sm">
                Book now
              </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-[55%]">
              <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80" alt="Facial" className="w-full h-full object-cover object-left" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#a67a5b] to-transparent"></div>
            </div>
          </div>

          {/* Spotlight Card 3 */}
          <div className="shrink-0 w-[85%] sm:w-[320px] snap-start relative rounded-xl overflow-hidden bg-[#e8e4df] flex aspect-[2/1] sm:aspect-[16/9]">
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center relative z-10">
              <h3 className="text-gray-900 text-lg sm:text-xl font-bold leading-tight mb-1">Home painting<br/>& waterproofing</h3>
              <p className="text-gray-600 text-xs mb-4">Top-rated 100% satisfaction</p>
              <button className="bg-black text-white text-xs font-bold py-1.5 px-4 rounded w-fit transition-colors">
                Book now
              </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-[45%]">
              <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80" alt="Painting" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 max-w-7xl mx-auto my-2"></div>

      {/* ── New and noteworthy ── */}
      <div className="py-6 max-w-7xl mx-auto w-full">
        <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 px-4 mb-4 tracking-tight">New and noteworthy</h2>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
          {[
             { title: 'Painting & Waterproofing', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80' },
             { title: 'Native Water Purifier', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80' },
             { title: 'Bathroom & Kitchen Cleaning', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80' },
             { title: 'Spa for Women', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=300&q=80' },
             { title: 'AC Repair & Service', img: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?auto=format&fit=crop&w=300&q=80' },
          ].map((item, i) => (
            <div key={i} className="w-[110px] sm:w-[130px] shrink-0 flex flex-col gap-2 cursor-pointer group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-[12px] font-medium text-gray-800 text-center leading-snug">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 max-w-7xl mx-auto my-2"></div>

      {/* ── Most booked services ── */}
      <div className="py-6 max-w-7xl mx-auto w-full">
        <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 px-4 mb-4 tracking-tight">Most booked services</h2>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
          {[
            { title: 'Power Jet AC service', rating: '4.83 (1M+)', price: '₹599', img: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?auto=format&fit=crop&w=400&q=80' },
            { title: 'AC repair', rating: '4.80 (244K)', price: '₹249', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80' },
            { title: 'Soothe & relax: Full arms, legs', rating: '4.84 (461K)', price: '₹949', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80' },
            { title: 'Intense cleaning (2 bathrooms)', rating: '4.80 (677K)', price: '₹899', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
            { title: 'Drill & hang (wall decor)', rating: '4.84 (99K)', price: '₹49', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className="w-[140px] shrink-0 flex flex-col cursor-pointer group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-[13px] font-medium text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-[11px] font-medium text-gray-600">{item.rating}</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900 mt-auto">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 max-w-7xl mx-auto my-2"></div>

      {/* ── Salon for Women ── */}
      <div className="py-6 max-w-7xl mx-auto w-full">
        <div className="px-4 flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">Salon for Women</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Free wax heater on first booking</p>
          </div>
          <button onClick={() => onNavigate?.('beauty-services')} className="text-blue-600 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">See all</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
          {[
            { title: 'Soothe & relax: Full arms, legs & underarms', rating: '4.84 (461K)', price: '₹949', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80' },
            { title: 'Roll on waxing (Full arms, legs & underarms)', rating: '4.86 (207K)', price: '₹699', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80' },
            { title: 'Aroma Magic de-tan glow facial', rating: '4.84 (265K)', price: '₹849', img: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80' },
            { title: 'Crystal rose pedicure', rating: '4.80 (215K)', price: '₹699', img: 'https://images.unsplash.com/photo-1516975080661-460971f11e9a?auto=format&fit=crop&w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className="w-[140px] shrink-0 flex flex-col cursor-pointer group">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-[13px] font-medium text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-[11px] font-medium text-gray-600">{item.rating}</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900 mt-auto">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Native RO water purifier Banner ── */}
      <div className="w-full bg-blue-900 my-6 relative overflow-hidden flex cursor-pointer">
        <div className="max-w-7xl mx-auto w-full flex">
          <div className="flex-1 px-5 py-8 sm:px-10 sm:py-12 z-10 flex flex-col justify-center">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-3 inline-block uppercase tracking-wider">Up to ₹3,500 off</span>
          <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2 tracking-tight">NATIVE<br/>RO water purifier</h3>
          <p className="text-blue-100 text-sm sm:text-base font-medium mb-6">Needs no service for 2 years</p>
          <button className="bg-white text-blue-900 font-bold px-5 py-2.5 rounded-lg shadow-sm w-fit transition-transform active:scale-95">
            Buy now
          </button>
          </div>
        </div>
        <div className="w-[45%] relative shrink-0">
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80" alt="Woman drinking water" className="w-full h-full object-cover opacity-90 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/40 to-transparent w-2/3"></div>
        </div>
      </div>

      {/* ── Cleaning Essentials ── */}
      <div className="py-6 max-w-7xl mx-auto w-full">
        <div className="px-4 flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">Cleaning Essentials</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Monthly cleaning essential services</p>
          </div>
          <button className="text-blue-600 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">See all</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
          {[
            { title: 'Intense cleaning (2 bathrooms)', rating: '4.80 (677K)', price: '₹899', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
            { title: 'Intense cleaning (1 bathroom)', rating: '4.80 (677K)', price: '₹499', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80' },
            { title: 'Mattress cleaning', rating: '4.84 (107K)', price: '₹399', img: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=400&q=80' },
            { title: 'Carpet cleaning', rating: '4.81 (52K)', price: '₹399', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80' },
            { title: 'Dining table & chairs cleaning', rating: '4.82 (34K)', price: '₹399', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className="w-[140px] shrink-0 flex flex-col cursor-pointer group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-[13px] font-medium text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-[11px] font-medium text-gray-600">{item.rating}</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900 mt-auto">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 max-w-7xl mx-auto my-2"></div>

      {/* ── Appliance repair & service ── */}
      <div className="py-6 max-w-7xl mx-auto w-full">
        <div className="px-4 flex items-end justify-between mb-4">
          <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">Appliance repair & service</h2>
          <button className="text-blue-600 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">See all</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
          {[
            { title: 'Power jet AC service', rating: '4.83 (1M+)', price: '₹599', img: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?auto=format&fit=crop&w=400&q=80' },
            { title: 'AC repair', rating: '4.80 (244K)', price: '₹249', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80' },
            { title: 'Washing machine repair', rating: '4.82 (175K)', price: '₹249', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=400&q=80' },
            { title: 'Water purifier repair', rating: '4.81 (120K)', price: '₹249', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
            { title: 'Native RO Service & repair', rating: '4.85 (42K)', price: '₹249', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className="w-[140px] shrink-0 flex flex-col cursor-pointer group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-[13px] font-medium text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-[11px] font-medium text-gray-600">{item.rating}</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900 mt-auto">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 max-w-7xl mx-auto my-2"></div>

      {/* ── Home repair & installation ── */}
      <div className="py-6 max-w-7xl mx-auto w-full">
        <div className="px-4 flex items-end justify-between mb-4">
          <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">Home repair & installation</h2>
          <button className="text-blue-600 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">See all</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
          {[
            { title: 'Drill & hang (wall decor)', rating: '4.84 (99K)', price: '₹49', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
            { title: 'Tap repair', rating: '4.78 (155K)', price: '₹49', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80' },
            { title: 'Fan repair & installation', rating: '4.81 (141K)', price: '₹99', img: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=400&q=80' },
            { title: 'Switch/socket replacement', rating: '4.83 (102K)', price: '₹49', img: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=400&q=80' },
            { title: 'Switchboard installation', rating: '4.82 (89K)', price: '₹149', img: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className="w-[140px] shrink-0 flex flex-col cursor-pointer group">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-[13px] font-medium text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-[11px] font-medium text-gray-600">{item.rating}</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900 mt-auto">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Native Smart locks Banner ── */}
      <div className="w-full bg-blue-950 my-6 relative overflow-hidden flex cursor-pointer">
        <div className="max-w-7xl mx-auto w-full flex">
          <div className="flex-1 px-5 py-8 sm:px-10 sm:py-12 z-10 flex flex-col justify-center">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-3 inline-block uppercase tracking-wider">Up to ₹1,500 off</span>
          <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2 tracking-tight">NATIVE<br/>Smart locks</h3>
          <p className="text-blue-200 text-sm sm:text-base font-medium mb-6">Camera. Doorbell. All-in one.</p>
          <div className="flex items-center gap-2 text-white">
            <span className="font-bold text-sm">Buy now</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            </div>
          </div>
        </div>
        <div className="w-[45%] bg-blue-950 shrink-0">
          <img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80" alt="Smart lock" className="w-full h-full object-cover mix-blend-luminosity opacity-70" />
        </div>
      </div>

    </div>
  );
}
