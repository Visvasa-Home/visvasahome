import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, ChevronRight, X, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { MobileBottomNav } from '@shared/components/MobileBottomNav';
import { StickyCartBar } from '@booking/components/StickyCartBar';
import { CartManager, Cart } from '@booking/services/cartManager';

interface SearchPageProps {
  onNavigate: (page: string) => void;
  onBookService: () => void;
  selectedLocation: string | null;
  onLocationSelect: (loc: string) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onProfile: () => void;
  commonHeaderProps: Record<string, unknown>;
  initialQuery?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  desc: string;
  startingFrom: number;
  rating: number;
  reviews: number;
  duration: string;
  popular: boolean;
  emoji: string;
  slug: string;
}

import { allServices as rawServices } from '@catalog/data/servicesData';

const allServices: Service[] = rawServices.map((s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  desc: s.description,
  startingFrom: s.price,
  rating: s.rating,
  reviews: s.reviews,
  duration: s.duration,
  popular: s.popular,
  emoji: s.emoji,
  slug: s.slug,
}));

const categories = ['All', ...Array.from(new Set(allServices.map((s) => s.category)))];

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
];

export function SearchPage({
  onNavigate,
  onBookService,
  isAuthenticated,
  onLogin,
  onProfile,
  commonHeaderProps,
  initialQuery = '',
}: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });

  useEffect(() => {
    const refresh = () => setCart(CartManager.getCart());
    refresh();
    window.addEventListener('visvasahome_cart_updated', refresh as any);
    return () => window.removeEventListener('visvasahome_cart_updated', refresh as any);
  }, []);

  const getQty = (serviceId: string) => cart.items.find((i) => i.id === serviceId)?.quantity ?? 0;

  const handleAdd = (service: Service) => {
    setCart(
      CartManager.addItem({
        id: service.id,
        serviceName: service.name,
        category: service.category,
        categorySlug: service.slug,
        price: service.startingFrom,
        duration: service.duration,
      })
    );
  };

  const handleDecrement = (service: Service) => {
    setCart(CartManager.decrementItem(service.id));
  };

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showSort, setShowSort] = useState(false);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = allServices;
    if (activeCategory !== 'All') {
      list = list.filter((s) => s.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const escapedQ = q.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
      const wordRegex = new RegExp(`\\b${escapedQ}\\b`);

      const scoredList = list.map((s) => {
        let score = 0;
        const nameLower = s.name.toLowerCase();
        const categoryLower = s.category.toLowerCase();
        const descLower = s.desc.toLowerCase();

        // Exact name match
        if (nameLower === q) {
          score += 500;
        }
        // Name starts with query
        else if (nameLower.startsWith(q)) {
          score += 300;
        }
        // Name contains query as a distinct word
        else if (wordRegex.test(nameLower)) {
          score += 200;
        }
        // Name simply contains query
        else if (nameLower.includes(q)) {
          score += 100;
        }

        // Category exact match
        if (categoryLower === q) {
          score += 250;
        }
        // Category starts with or contains query as a word
        else if (categoryLower.startsWith(q) || wordRegex.test(categoryLower)) {
          score += 150;
        }
        // Category simply contains query
        else if (categoryLower.includes(q)) {
          score += 50;
        }

        // Description contains query as a distinct word
        if (wordRegex.test(descLower)) {
          score += 30;
        }
        // Description simply contains query
        else if (descLower.includes(q)) {
          score += 10;
        }

        return { service: s, score };
      });

      // Filter out items with score = 0, sort by score descending
      list = scoredList
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.service);
    }

    if (showPopularOnly) {
      list = list.filter((s) => s.popular);
    }

    // Secondary sorts
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.startingFrom - b.startingFrom);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.startingFrom - a.startingFrom);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'reviews') list = [...list].sort((a, b) => b.reviews - a.reviews);
    
    return list;
  }, [query, activeCategory, sortBy, showPopularOnly]);

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.label || 'Sort';

  const showSuggestionsPortal = !query.trim() && activeCategory === 'All' && !showPopularOnly;
  const resultsToShow = useMemo(() => filtered.slice(0, 50), [filtered]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header with Cart & Sticky Bar support */}
      <Header
        {...(commonHeaderProps as any)}
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
        onLogin={onLogin}
        onProfile={onProfile}
        hideBarOnMobile={true}
      />

      {/* Search & Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            {/* Mobile Back Button */}
            <button
              onClick={() => onNavigate('home')}
              className="lg:hidden p-2 hover:bg-gray-150 rounded-xl transition-all flex-shrink-0"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services (e.g. AC repair, cleaning, painting...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Sort Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeSortLabel}
              </button>
              {showSort && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 w-44">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${sortBy === opt.value ? 'text-[#2563EB] bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Toggle */}
            <button
              onClick={() => setShowPopularOnly(!showPopularOnly)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                showPopularOnly ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              ⭐ Popular
            </button>

            {/* Category Pills */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-5">
        {showSuggestionsPortal ? (
          <div className="space-y-8 animate-fade-in py-2">
            {/* Popular Searches */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                🔥 Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { term: 'AC Service & Cleaning', query: 'AC' },
                  { term: 'Home Deep Cleaning', query: 'Cleaning' },
                  { term: 'Drain Unclogging', query: 'Drain' },
                  { term: 'Fan Repair & Installation', query: 'Fan' },
                  { term: 'Switchboard Repair/Install', query: 'Switch' },
                  { term: 'Sofa & Curtain Cleaning', query: 'Sofa' },
                  { term: 'Pest Control Contractors', query: 'Pest' },
                  { term: 'Wall Painting', query: 'Painting' },
                  { term: 'Haircut & Styling', query: 'Haircut' },
                  { term: 'Massage Therapy', query: 'Massage' }
                ].map((item) => (
                  <button
                    key={item.term}
                    onClick={() => setQuery(item.query)}
                    className="px-3.5 py-2 bg-white hover:bg-blue-50 text-gray-700 hover:text-[#2563EB] border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
                  >
                    {item.term}
                  </button>
                ))}
              </div>
            </div>

            {/* Explore Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                📁 Explore Service Categories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { name: 'Plumbing', emoji: '🚰', slug: 'Plumbing' },
                  { name: 'Electrical', emoji: '⚡', slug: 'Electrical' },
                  { name: 'AC Service', emoji: '❄️', slug: 'AC Service' },
                  { name: 'Home Cleaning', emoji: '✨', slug: 'Cleaning' },
                  { name: 'Appliance Repair', emoji: '🔌', slug: 'Appliance' },
                  { name: 'Pest Control', emoji: '🐜', slug: 'Pest Control' },
                  { name: 'Wall Painting', emoji: '🎨', slug: 'Painting' },
                  { name: 'Carpentry', emoji: '🔨', slug: 'Carpentry' },
                  { name: 'Interior Design', emoji: '🛋️', slug: 'Interior Design' },
                  { name: 'Landscaping', emoji: '🌳', slug: 'Landscaping' },
                  { name: 'Salon at Home', emoji: '💅', slug: 'Beauty & Salon' },
                  { name: 'Wellness & Massage', emoji: '🧘', slug: 'Wellness' }
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.slug)}
                    className="flex items-center gap-3 p-3.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-left transition-all duration-300 group shadow-2xs hover:shadow-xs active:scale-97 cursor-pointer"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                    <span className="font-extrabold text-gray-800 text-xs tracking-tight group-hover:text-[#2563EB] transition-colors">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Safe & Secure Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-premium flex flex-col sm:flex-row items-center gap-4">
              <span className="text-4xl shrink-0">🛡️</span>
              <div className="text-center sm:text-left">
                <p className="font-black text-sm text-white">100% Background-Verified Professionals</p>
                <p className="text-white/85 text-xs mt-1 leading-relaxed">
                  Every booking is protected by Visvasa escrow and includes up to a 90-day service warranty and insurance.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filtered.length}</span> services found
                {query && <span> for "<span className="text-[#2563EB]">{query}</span>"</span>}
              </p>
              {(query || activeCategory !== 'All' || showPopularOnly) && (
                <button
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('All');
                    setShowPopularOnly(false);
                    setSortBy('relevance');
                  }}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {resultsToShow.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-bold text-gray-700 mb-1">No services found</p>
                <p className="text-gray-500 text-sm">Try a different search term or category</p>
                <button
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('All');
                    setShowPopularOnly(false);
                    setSortBy('relevance');
                  }}
                  className="mt-4 text-[#2563EB] text-sm font-semibold hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.length > 50 && (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2.5 rounded-xl font-semibold border border-amber-100 mb-3">
                    💡 Showing top 50 matches. Refine your query for more options.
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                  {resultsToShow.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => onNavigate(svc.slug)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-blue-400/50 transition-all flex flex-col cursor-pointer hover:-translate-y-0.5 duration-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{svc.emoji}</span>
                          <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">{svc.category}</span>
                        </div>
                        {svc.popular && (
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">Popular</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">{svc.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3">{svc.desc}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-gray-700">{svc.rating}</span>
                          <span>({svc.reviews.toLocaleString()})</span>
                        </span>
                        <span>⏱ {svc.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Starting from</p>
                          <p className="font-bold text-gray-900">₹{svc.startingFrom.toLocaleString()}</p>
                        </div>
                        {(() => {
                          const qty = getQty(svc.id);
                          return qty === 0 ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAdd(svc); }}
                              className="flex items-center gap-1 px-4 py-2 bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl transition-all active:scale-95 shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              ADD
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center bg-[#2563EB] rounded-xl overflow-hidden shadow-sm shrink-0"
                            >
                              <button
                                onClick={() => qty === 1 ? CartManager.removeItem(svc.id) : handleDecrement(svc)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
                              >
                                {qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-white" /> : <Minus className="w-3.5 h-3.5 text-white font-bold" />}
                              </button>
                              <span className="w-6 text-center text-xs font-black text-white">{qty}</span>
                              <button
                                onClick={() => handleAdd(svc)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 text-white font-bold" />
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <MobileBottomNav
        currentPage="search"
        onNavigate={onNavigate}
        onMenuOpen={() => onNavigate('menu')}
      />

      {/* Sticky Cart Bar — floats above bottom nav when cart has items */}
      <div className="pb-16 lg:pb-0">
        <StickyCartBar onViewCart={onBookService} />
      </div>
    </div>
  );
}
