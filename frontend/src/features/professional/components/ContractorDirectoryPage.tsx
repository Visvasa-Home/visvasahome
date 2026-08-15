import { ChevronLeft, Star, CheckCircle, Shield, Award, ArrowRight, CalendarDays, ClipboardCheck, Sparkles } from 'lucide-react';

interface ContractorDirectoryPageProps {
  projectData: any;
  onBack: () => void;
  onRequestQuote: (contractorId: string) => void;
}

export function ContractorDirectoryPage({ projectData, onBack, onRequestQuote }: ContractorDirectoryPageProps) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
      {/* App Header */}
      <div className="bg-white px-4 py-3 sm:py-4 flex items-center shadow-sm flex-shrink-0 safe-area-top">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95 mr-2"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div>
          <h1 className="text-base font-black text-gray-900 tracking-tight leading-tight">
            Book Site Visit
          </h1>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
            {projectData?.size || 'Project'} • {projectData?.timeline || 'Anytime'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="text-center space-y-2 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900">VisvasaHome Experts</h2>
            <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
              We don't use third parties. We assign our own highly trained, verified in-house experts for your project.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-premium border border-blue-100 relative overflow-hidden mt-8">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
              PREMIUM SERVICE
            </div>
            
            <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Why Choose VisvasaHome?
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Direct Responsibility</p>
                  <p className="text-xs text-gray-500 font-medium">No middle-men. We take full responsibility for the quality and delivery of your project.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ClipboardCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Transparent Pricing</p>
                  <p className="text-xs text-gray-500 font-medium">After the free site visit, we provide a detailed, itemized quote with no hidden charges.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Guaranteed Timelines</p>
                  <p className="text-xs text-gray-500 font-medium">We commit to a delivery date and stick to it, backed by our SLA.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500">Next Step</p>
            <p className="text-sm font-black text-gray-900">Free Site Survey</p>
          </div>
          <button
            onClick={() => onRequestQuote('visvasahome-internal')}
            className="px-8 py-3.5 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <CalendarDays className="w-4 h-4" />
            Book Free Visit
          </button>
        </div>
      </div>
    </div>
  );
}
