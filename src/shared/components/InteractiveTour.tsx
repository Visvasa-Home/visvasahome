import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, Compass, HelpCircle } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'center';
}

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-location-selector',
    title: '📍 1. Select Your Location',
    description: 'Set your city and locality first. This is crucial for verifying service availability, dynamic pricing, and local tax rates in your neighborhood.',
    position: 'bottom'
  },
  {
    targetId: 'tour-services-grid',
    title: '🛠️ 2. Choose a Household Service',
    description: 'Browse through categories like AC repair, cleaning, plumbing, or salon services. Add tasks to your cart and book verified experts in minutes.',
    position: 'top'
  },
  {
    targetId: 'tour-amc-menu',
    title: '📅 3. Annual Maintenance Contracts (AMC)',
    description: 'Get year-round peace of mind. Choose from Yearly Home AMC packages covering appliance health checks, electricals, and plumbing inspections.',
    position: 'bottom'
  },
  {
    targetId: 'tour-join-pro',
    title: '💼 4. Partner Program (Earn with Us)',
    description: 'Are you a local service expert? Register here to switch your dashboard, view active jobs in your area, and start earning as a verified Visvasa Partner.',
    position: 'bottom'
  },
  {
    targetId: 'tour-user-menu',
    title: '👤 5. Real-Time Tracking & Chat',
    description: 'Log in to track your assigned professional live on the map, chat with them, rate services, and manage your booked AMC schedules from your profile.',
    position: 'bottom'
  }
];

export function InteractiveTour() {
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('visvasahome_tour_completed');
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  // Recalculate target element bounding rect to align highlight glow on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      const step = tourSteps[activeStep];
      const el = document.getElementById(step.targetId);
      if (el) {
        setHighlightRect(el.getBoundingClientRect());
      } else {
        setHighlightRect(null);
      }
    };

    updateRect();

    // Scroll target element into viewport center
    const el = document.getElementById(tourSteps[activeStep].targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Delay slightly to allow scroll completion before taking rect
    const timer = setTimeout(updateRect, 400);

    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [activeStep, isOpen]);

  const handleStartTour = () => {
    setShowWelcome(false);
    setIsOpen(true);
    setActiveStep(0);
  };

  const handleNext = () => {
    if (activeStep < tourSteps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleCompleteTour();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCompleteTour = () => {
    localStorage.setItem('visvasahome_tour_completed', 'true');
    setIsOpen(false);
  };

  const handleSkipTour = () => {
    localStorage.setItem('visvasahome_tour_completed', 'true');
    setIsOpen(false);
    setShowWelcome(false);
  };

  return (
    <>
      {/* Floating Tour Button */}
      <button
        onClick={handleStartTour}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-wider group"
        title="Start Quick Interactive Site Tour"
      >
        <Compass className="w-4 h-4 animate-spin group-hover:scale-110" style={{ animationDuration: '6s' }} />
        <span>Site Guide</span>
      </button>

      {/* 1. Welcome Modal Onboarding Dialog */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top gradient stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            <button
              onClick={handleSkipTour}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-100">
              <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
              Welcome to VisvasaHome!
            </h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">
              New here? Take a quick 1-minute interactive tour to understand how to book doorstep services, purchase home protection plans, or register as a partner.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartTour}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:opacity-95 shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Take Interactive Tour</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSkipTour}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 font-bold hover:underline"
              >
                Maybe Later / Skip Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Active Tour Overlay & Highlights */}
      {isOpen && (
        <>
          {/* Semi-transparent dark background */}
          <div className="fixed inset-0 bg-black/45 z-[99990] transition-opacity duration-300 pointer-events-none" />

          {/* Highlight Target Border/Glow Box */}
          {highlightRect && (
            <div
              style={{
                position: 'fixed',
                top: highlightRect.top - 6,
                left: highlightRect.left - 6,
                width: highlightRect.width + 12,
                height: highlightRect.height + 12,
                border: '3px solid #2563EB',
                borderRadius: '12px',
                zIndex: 99991,
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45), 0 0 15px 5px rgba(37, 99, 235, 0.6)',
                transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              className="animate-pulse"
            />
          )}

          {/* Dialog Tooltip Card */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-sm w-full mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-[99992] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Guide Card Header */}
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 animate-bounce" />
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Site Guide
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400">
                Step {activeStep + 1} of {tourSteps.length}
              </span>
            </div>

            {/* Guide Info */}
            <div className="space-y-1">
              <h4 className="text-sm font-black text-gray-900 leading-snug">
                {tourSteps[activeStep].title}
              </h4>
              <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                {tourSteps[activeStep].description}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-50">
              <button
                onClick={handleSkipTour}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold hover:underline"
              >
                Skip
              </button>

              <div className="flex gap-2">
                {activeStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 rounded-xl text-xs font-black transition-all shadow-xs"
                >
                  <span>{activeStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
