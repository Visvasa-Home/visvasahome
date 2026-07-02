import { useState, useEffect } from 'react';
import { Shield, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface CookieConsentProps {
  onPreferencesClick?: () => void;
}

export function CookieConsent({ onPreferencesClick }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('visvasahome_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(consent);
        setPreferences(parsed);
      } catch (e) {
        localStorage.removeItem('visvasahome_cookie_consent');
        setIsVisible(true);
      }
    }
  }, []);

  const savePreferences = (updatedPrefs: typeof preferences) => {
    localStorage.setItem('visvasahome_cookie_consent', JSON.stringify(updatedPrefs));
    setPreferences(updatedPrefs);
    setIsVisible(false);

    // Dispatch custom event to let analytics scripts know consent changed
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: updatedPrefs }));
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-5 z-[9999] transition-all duration-500 transform translate-y-0 animate-in slide-in-from-bottom-10">
      <div className="flex gap-4">
        <div className="p-3 bg-blue-50 rounded-xl self-start">
          <Shield className="w-6 h-6 text-[#2563EB]" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-bold text-gray-900">Cookie Preferences</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We use cookies to improve your browsing experience, serve personalized ads or content, and analyze our traffic. In compliance with the DPDP Act 2023, you can choose which cookies you accept.{' '}
            {onPreferencesClick && (
              <button
                onClick={onPreferencesClick}
                className="text-[#2563EB] underline font-medium hover:text-blue-700 focus:outline-none"
              >
                Read Privacy Policy.
              </button>
            )}
          </p>
        </div>
      </div>

      {showCustomizer && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
          {/* Essential */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Essential (Required)</h4>
              <p className="text-[10px] text-gray-500 leading-normal">Necessary for the website to function, such as authentication and security checks.</p>
            </div>
            <div className="flex items-center justify-center w-8 h-5 bg-blue-100 rounded-full cursor-not-allowed">
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full translate-x-1.5 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Analytics & Performance</h4>
              <p className="text-[10px] text-gray-500 leading-normal">Allows us to analyze page traffic and usage to improve the VisvasaHome experience.</p>
            </div>
            <button
              onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                preferences.analytics ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  preferences.analytics ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Marketing */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Marketing & Targeting</h4>
              <p className="text-[10px] text-gray-500 leading-normal">Used to deliver relevant ads and measure effectiveness of our marketing campaigns.</p>
            </div>
            <button
              onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                preferences.marketing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  preferences.marketing ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 justify-between items-center">
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 py-1"
        >
          {showCustomizer ? (
            <>
              Hide Settings <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Customize Settings <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex gap-2">
          {showCustomizer ? (
            <>
              <button
                onClick={handleSaveCustom}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all active:scale-95"
              >
                Save Preferences
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRejectAll}
                className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all active:scale-95"
              >
                Accept All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
