import { useState } from 'react';
import { ArrowRight, Shield, Clock, Star, CheckCircle } from 'lucide-react';

interface OnboardingScreensProps {
  onComplete: () => void;
}

const screens = [
  {
    title: 'Book Trusted Professionals',
    description: 'Access 500+ verified service professionals across 20 cities',
    icon: Shield,
    color: 'text-[#2563EB]',
    bgColor: 'bg-blue-50',
  },
  {
    title: '30-Min Arrival Guarantee',
    description: 'Fast booking confirmation and quick arrival times',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Rated 4.8/5 by Customers',
    description: 'Join 10,000+ satisfied customers across India',
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];

export function OnboardingScreens({ onComplete }: OnboardingScreensProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      localStorage.setItem('visvasahome_onboarding_completed', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('visvasahome_onboarding_completed', 'true');
    onComplete();
  };

  const current = screens[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        {/* Icon */}
        <div className={`w-32 h-32 rounded-full ${current.bgColor} flex items-center justify-center mb-8`}>
          <current.icon className={`w-16 h-16 ${current.color}`} />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {current.title}
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 text-center max-w-md mb-12">
          {current.description}
        </p>

        {/* Dots Indicator */}
        <div className="flex gap-2 mb-12">
          {screens.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-[#2563EB] w-8'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full max-w-md px-8 py-4 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          {currentIndex === screens.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
