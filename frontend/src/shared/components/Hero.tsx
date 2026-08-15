import { Search as SearchIcon, MapPin, ChevronDown, Scissors, Activity, Sparkles, Car, Wind, Hammer, Heart, TrendingUp, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LocationSelector } from "@shared/components/LocationSelector";

interface HeroProps {
  onGetStarted: () => void;
  onCategoryClick?: (slug: string, data?: any) => void;
  selectedLocation?: string | null;
  onLocationSelect: (location: string) => void;
}

const SEARCH_TERMS = ["AC Repair", "Plumber", "Sofa Cleaning", "Men's Haircut", "Full Home Cleaning"];
const TRENDING_SEARCHES = ["AC Service & Repair", "Bathroom Cleaning", "Native Water Purifier", "Sofa Cleaning", "Electrician", "RO Repair"];

export function Hero({ onCategoryClick, selectedLocation, onLocationSelect }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Typing Effect State
  const [placeholderText, setPlaceholderText] = useState("");
  const [termIndex, setTermIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: "Women's Salon & Spa", icon: Scissors, slug: "beauty-services" },
    { name: "Men's Salon & Massage", icon: Scissors, slug: "mens-grooming" },
    { name: "AC & Appliance Repair", icon: Wind, slug: "ac-services" },
    { name: "Cleaning & Pest Control", icon: Sparkles, slug: "cleaning-services" },
    { name: "Plumber & Carpenter", icon: Hammer, slug: "plumbing-services" },
    { name: "Healthcare at Home", icon: Activity, slug: "healthcare-services" },
    { name: "Car & Bike Service", icon: Car, slug: "vehicle-services" },
    { name: "Home Painting", icon: Heart, slug: "painting-services" },
  ];

  // Typing Effect Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const currentTerm = SEARCH_TERMS[termIndex];
    
    if (isDeleting) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentTerm.substring(0, placeholderText.length - 1));
        if (placeholderText.length === 0) {
          setIsDeleting(false);
          setTermIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
        }
      }, 50); // Deleting speed
    } else {
      timeout = setTimeout(() => {
        setPlaceholderText(currentTerm.substring(0, placeholderText.length + 1));
        if (placeholderText.length === currentTerm.length) {
          timeout = setTimeout(() => setIsDeleting(true), 2000); // Pause before deleting
        }
      }, 100); // Typing speed
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, termIndex]);

  // Click Outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section className="bg-white pt-8 pb-4 border-b border-gray-100 relative z-30">
      {/* Mobile Search Overlay Background */}
      {isSearchFocused && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSearchFocused(false)}></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <LocationSelector 
            selectedLocation={selectedLocation}
            onLocationSelect={onLocationSelect}
            customTrigger={
              <div className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <MapPin className="w-4 h-4 text-gray-700" strokeWidth={2} />
                <span className="text-[13px] font-bold text-gray-900 truncate max-w-[120px]">
                  {selectedLocation || 'Jaipur'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
              </div>
            }
          />
        </div>

        {/* Main Hero Content */}
        <div className="flex flex-col items-center justify-center text-center mt-2 sm:mt-10 mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-gray-900 tracking-tight leading-[1.1] mb-6 sm:mb-8">
            Home services at your doorstep
          </h1>

          {/* Search Container */}
          <div ref={searchContainerRef} className={`w-full max-w-3xl relative transition-all duration-300 ${isSearchFocused ? 'md:scale-105' : ''}`}>
            
            {/* Search Input Box */}
            <div className={`relative z-20 bg-white border p-2 sm:p-2.5 transition-all duration-300 ${
              isSearchFocused 
                ? 'border-blue-500 shadow-2xl shadow-blue-500/20 rounded-t-2xl sm:rounded-t-[20px] rounded-b-none border-b-gray-100' 
                : 'border-gray-200/80 shadow-xl shadow-gray-200/50 rounded-2xl sm:rounded-[20px]'
            }`}>
              <div className={`flex items-center transition-colors overflow-hidden px-4 sm:px-6 h-12 sm:h-16 ${isSearchFocused ? 'bg-white rounded-xl' : 'bg-gray-50 hover:bg-gray-100/80 rounded-xl'}`}>
                <SearchIcon className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-colors ${isSearchFocused ? 'text-blue-600' : 'text-gray-500'}`} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder={`Search for '${placeholderText}'`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full h-full text-[15px] sm:text-[17px] outline-none text-gray-900 placeholder:text-gray-400 font-medium bg-transparent px-3 sm:px-4" 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-blue-500 rounded-b-2xl sm:rounded-b-[20px] shadow-2xl shadow-blue-500/20 z-10 overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto py-2">
                  
                  {/* Empty State: Trending Searches */}
                  {!searchQuery && (
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-3 px-2 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" /> Trending Searches
                      </div>
                      <div className="flex flex-col">
                        {TRENDING_SEARCHES.map((term, i) => (
                          <button 
                            key={i} 
                            onClick={() => {
                              setSearchQuery(term);
                              // In a real app, this might navigate or search directly
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg text-left group"
                          >
                            <SearchIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" strokeWidth={2} />
                            <span className="text-gray-700 font-medium text-[15px] group-hover:text-blue-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered State: Categories */}
                  {searchQuery && (
                    <div className="px-2">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat, i) => (
                          <button 
                            key={i}
                            onClick={() => {
                              setIsSearchFocused(false);
                              onCategoryClick?.(cat.slug);
                            }}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50 text-left group border-b border-gray-50 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center">
                              <cat.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <span className="text-gray-800 font-bold text-[15px] group-hover:text-blue-700">{cat.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                          <SearchIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="font-medium text-[15px]">No services found for "{searchQuery}"</p>
                          <p className="text-sm mt-1">Try searching for AC, Cleaning, or Plumber</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories Row */}
        <div className="mb-4">
          <h3 className="text-[15px] font-bold text-gray-900 text-center mb-6 tracking-tight hidden sm:block">What are you looking for?</h3>
          
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-x-2 gap-y-6 sm:gap-4 max-w-5xl mx-auto relative z-10">
            {categories.map((cat, i) => (
              <button 
                key={i}
                onClick={() => onCategoryClick?.(cat.slug)}
                className="flex flex-col items-center gap-2.5 sm:gap-3 group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-sm">
                  <cat.icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] sm:text-[13px] font-semibold text-gray-700 leading-tight text-center px-1">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
