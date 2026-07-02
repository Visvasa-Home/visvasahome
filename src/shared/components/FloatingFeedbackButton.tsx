import { useState } from 'react';
import { MessageSquare, Bug, X } from 'lucide-react';
import { FeedbackModal } from '@shared/components/FeedbackModal';
import { BugReportModal } from '@shared/components/BugReportModal';

export function FloatingFeedbackButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Menu Options */}
        {isMenuOpen && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <button
              onClick={() => {
                setIsFeedbackOpen(true);
                setIsMenuOpen(false);
              }}
              className="group flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-blue-200"
            >
              <div className="bg-blue-100 p-2 rounded-full group-hover:bg-[#2563EB] transition-colors">
                <MessageSquare className="w-5 h-5 text-[#2563EB] group-hover:text-white" />
              </div>
              <span className="font-semibold text-gray-900 whitespace-nowrap pr-2">
                Share Feedback
              </span>
            </button>

            <button
              onClick={() => {
                setIsBugReportOpen(true);
                setIsMenuOpen(false);
              }}
              className="group flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-red-300"
            >
              <div className="bg-red-100 p-2 rounded-full group-hover:bg-red-600 transition-colors">
                <Bug className="w-5 h-5 text-red-600 group-hover:text-white" />
              </div>
              <span className="font-semibold text-gray-900 whitespace-nowrap pr-2">
                Report a Bug
              </span>
            </button>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`group relative bg-gradient-to-r from-[#2563EB] to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all hover:scale-110 ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          aria-label="Feedback Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}

          {/* Pulse animation when closed */}
          {!isMenuOpen && (
            <span className="absolute inset-0 rounded-full bg-[#2563EB] animate-ping opacity-20"></span>
          )}
        </button>

        {/* Tooltip */}
        {!isMenuOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              Feedback & Support
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-l-8 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
      />
    </>
  );
}
