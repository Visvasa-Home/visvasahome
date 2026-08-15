import { useState } from 'react';
import { ChevronLeft, Building, Home, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Search } from 'lucide-react';

interface ContractorProjectPageProps {
  categorySlug: string;
  categoryName: string;
  onBack: () => void;
  onContinue: (projectData: any) => void;
}

export function ContractorProjectPage({ categoryName, categorySlug, onBack, onContinue }: ContractorProjectPageProps) {
  const [projectSize, setProjectSize] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');

  const projectSizes = [
    { id: '1bhk', label: '1 BHK', desc: 'Up to 600 sq.ft' },
    { id: '2bhk', label: '2 BHK', desc: '600 - 1000 sq.ft' },
    { id: '3bhk', label: '3 BHK', desc: '1000 - 1500 sq.ft' },
    { id: 'villa', label: 'Villa / Custom', desc: '1500+ sq.ft' }
  ];

  const timelines = [
    { id: 'immediate', label: 'Immediately' },
    { id: '1week', label: 'Within 1 Week' },
    { id: '1month', label: 'Within 1 Month' },
    { id: 'planning', label: 'Just Planning' }
  ];

  const handleContinue = () => {
    if (projectSize && timeline) {
      onContinue({ size: projectSize, timeline, category: categorySlug });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
      {/* App Header */}
      <div className="bg-white px-4 py-3 sm:py-4 flex items-center justify-between shadow-sm flex-shrink-0 safe-area-top">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
              Hire a {categoryName.replace('Contractors', 'Contractor')}
            </h1>
            <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verified Project Specialists
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Step 1: Project Size */}
          <section className="bg-white rounded-3xl p-5 shadow-premium border border-gray-100">
            <h2 className="text-base font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              What is your project size?
            </h2>
            <p className="text-xs text-gray-500 mb-4 pl-8">Select the area scope for your project.</p>
            
            <div className="grid grid-cols-2 gap-3 pl-8">
              {projectSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setProjectSize(size.id)}
                  className={`flex flex-col p-4 rounded-2xl border-2 transition-all text-left ${
                    projectSize === size.id 
                      ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Building className={`w-5 h-5 ${projectSize === size.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    {projectSize === size.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className={`font-bold text-sm ${projectSize === size.id ? 'text-blue-900' : 'text-gray-700'}`}>
                    {size.label}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 mt-0.5">{size.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Timeline */}
          <section className="bg-white rounded-3xl p-5 shadow-premium border border-gray-100">
            <h2 className="text-base font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              When do you need to start?
            </h2>
            <p className="text-xs text-gray-500 mb-4 pl-8">Helps us find contractors available for your dates.</p>
            
            <div className="grid grid-cols-2 gap-3 pl-8">
              {timelines.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setTimeline(time.id)}
                  className={`px-4 py-3.5 rounded-xl border-2 transition-all text-left font-semibold text-sm ${
                    timeline === time.id 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm' 
                      : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500">Selected</p>
            <p className="text-sm font-black text-gray-900">
              {projectSize && timeline ? 'Ready to find pros' : 'Complete steps above'}
            </p>
          </div>
          <button
            onClick={handleContinue}
            disabled={!projectSize || !timeline}
            className={`px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              projectSize && timeline 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25' 
                : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
            }`}
          >
            Find Contractors
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
