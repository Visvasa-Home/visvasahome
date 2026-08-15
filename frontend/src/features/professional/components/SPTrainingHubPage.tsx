import { useState, useEffect } from 'react';
import { Video, BookOpen, Award, CheckCircle, ChevronRight, Play, ExternalLink, ShieldCheck, Trophy, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Alert, AlertDescription } from '@shared/ui/alert';

interface SPTrainingHubPageProps {
  onBack: () => void;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'technical' | 'soft-skills' | 'platform';
  duration: string;
  videoUrl: string;
  youtubeId: string;
  completed: boolean;
}

export const SPTrainingHubPage = ({ onBack }: SPTrainingHubPageProps) => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'safety' | 'technical' | 'soft-skills' | 'platform'>('all');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  // Mock professional name
  const spName = localStorage.getItem('visvasahome_sp_name') || 'Vikram Singh';

  useEffect(() => {
    // Load completion progress from localStorage
    const savedProgress = localStorage.getItem('sp_training_completed_ids');
    const completedIds: string[] = savedProgress ? JSON.parse(savedProgress) : [];

    const defaultModules: TrainingModule[] = [
      {
        id: 'MOD001',
        title: 'VisvasaHome Platform Guidelines & Conduct',
        description: 'Learn platform policies, customer safety rules, dress codes, and how to verify start/complete OTPs.',
        category: 'platform',
        duration: '6 mins',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        completed: completedIds.includes('MOD001')
      },
      {
        id: 'MOD002',
        title: 'Electrical Hazards & On-site Safety Standards',
        description: 'Critical safety checks before electrical wiring and repair tasks. Protective equipment guidelines.',
        category: 'safety',
        duration: '12 mins',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        completed: completedIds.includes('MOD002')
      },
      {
        id: 'MOD003',
        title: 'Customer Communication & Soft Skills Training',
        description: 'How to communicate effectively, handle complaints, maintain hygiene, and earn 5-star ratings.',
        category: 'soft-skills',
        duration: '8 mins',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        completed: completedIds.includes('MOD003')
      },
      {
        id: 'MOD004',
        title: 'Advanced AC Servicing & Jet-Pump Cleaning Techniques',
        description: 'Step-by-step masterclass on deep cleaning indoor/outdoor AC units using jet pumps.',
        category: 'technical',
        duration: '15 mins',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        completed: completedIds.includes('MOD004')
      },
      {
        id: 'MOD005',
        title: 'Leak Detection & High-Pressure Plumbing Fittings',
        description: 'How to handle complex pipe leakage and install modern high-pressure plumbing valves.',
        category: 'technical',
        duration: '10 mins',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        completed: completedIds.includes('MOD005')
      }
    ];
    setModules(defaultModules);
  }, []);

  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.completed).length;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const isFullyCertified = completedModules === totalModules && totalModules > 0;

  const handleMarkCompleted = (moduleId: string) => {
    const updated = modules.map(m =>
      m.id === moduleId ? { ...m, completed: true } : m
    );
    setModules(updated);

    const completedIds = updated.filter(m => m.completed).map(m => m.id);
    localStorage.setItem('sp_training_completed_ids', JSON.stringify(completedIds));

    // Show achievement sound chime or notification
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  };

  const handlePlayMockVideo = (mod: TrainingModule) => {
    setSelectedModule(mod);
    setPlayingVideo(true);
    setPlayProgress(0);

    // Simulate video play-progress over 3 seconds for demonstration
    const duration = 3000;
    const intervalTime = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setPlayProgress(progress);

      if (progress >= 100) {
        clearInterval(timer);
        handleMarkCompleted(mod.id);
      }
    }, intervalTime);
  };

  const filteredModules = activeTab === 'all'
    ? modules
    : modules.filter(m => m.category === activeTab);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] pb-24 relative">
      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2563EB]" />
              Partner Training Hub
            </h1>
            <p className="text-xs text-[color:var(--color-text-secondary)] font-medium">
              Watch service masterclasses and get verified certificates
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Card */}
        <Card className="rounded-3xl shadow-md border-transparent bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Trophy className="w-28 h-28 text-amber-400" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Certification Progress
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-semibold">
              Complete all 5 core modules to unlock your Visvasa Verified Partner Certificate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xs font-black tracking-wider uppercase">
              <span>Progress</span>
              <span className="text-amber-400">{progressPercent}% ({completedModules}/{totalModules} completed)</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {isFullyCertified ? (
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex flex-col gap-3 mt-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-sm text-emerald-300">Congratulations! You are Certified</h5>
                    <p className="text-[11px] text-emerald-200/80 leading-relaxed font-medium mt-0.5">
                      Your background check and technical verification assessments are verified. Click below to view and save your certificate.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCertificate(true)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
                >
                  <Award className="w-4 h-4" /> View Verified Certificate
                </Button>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">
                * Please finish all technical, conduct and safety video modules to qualify for premium jobs and the verification badge.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tab Filters */}
        <div className="flex overflow-x-auto gap-1.5 pb-2 scrollbar-none">
          {(['all', 'technical', 'safety', 'soft-skills', 'platform'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap border capitalize transition-all duration-300
                ${activeTab === tab
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-600'}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {filteredModules.map((mod) => (
            <Card key={mod.id} className="rounded-3xl border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-4">
                {/* Visual Thumbnail simulation */}
                <div
                  onClick={() => handlePlayMockVideo(mod)}
                  className="w-full md:w-44 h-28 bg-slate-900 rounded-2xl flex-shrink-0 flex items-center justify-center relative cursor-pointer group overflow-hidden border border-slate-800"
                >
                  <div className="absolute inset-0 bg-slate-950 opacity-40 group-hover:opacity-20 transition-opacity"></div>
                  {/* Category overlay */}
                  <span className="absolute top-2 left-2 text-[9px] bg-slate-800/80 text-gray-300 font-extrabold uppercase py-0.5 px-2 rounded-lg border border-slate-700">
                    {mod.category}
                  </span>
                  {/* Duration overlay */}
                  <span className="absolute bottom-2 right-2 text-[9px] bg-black/85 text-white font-mono py-0.5 px-1.5 rounded">
                    {mod.duration}
                  </span>

                  {mod.completed ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center z-10 border border-emerald-400/40">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Module Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-sm text-gray-900 leading-snug truncate max-w-sm sm:max-w-md">
                        {mod.title}
                      </h3>
                      {mod.completed && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 font-black text-[9px] py-0.5 px-1.5 rounded-lg flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                      {mod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase">Module {mod.id}</span>
                    <Button
                      onClick={() => handlePlayMockVideo(mod)}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {mod.completed ? 'Watch Again' : 'Start Lesson'} <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mock Video Playing Modal overlay */}
      {playingVideo && selectedModule && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-950 text-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-800 shadow-2xl relative">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500 animate-pulse" />
                <h4 className="font-bold text-xs truncate max-w-[240px]">{selectedModule.title}</h4>
              </div>
              {playProgress >= 100 && (
                <button
                  onClick={() => setPlayingVideo(false)}
                  className="text-gray-400 hover:text-white text-xs font-bold"
                >
                  Close
                </button>
              )}
            </div>

            {/* Video Box Container */}
            <div className="aspect-video bg-black flex items-center justify-center flex-col p-8 relative">
              {playProgress < 100 ? (
                <>
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xs text-gray-400 font-bold">Simulating video playback guide...</p>
                  {/* Simulated ProgressBar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="bg-blue-500 h-full transition-all" style={{ width: `${playProgress}%` }}></div>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-3 p-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h5 className="font-black text-sm text-white">Lesson Completed!</h5>
                  <p className="text-[11px] text-gray-400">Progress registered in Visvasa Partner Profile.</p>
                  <Button
                    onClick={() => setPlayingVideo(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2 rounded-xl mt-2 active:scale-95"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* High Fidelity Certificate Viewer Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-1 shadow-2xl border border-amber-200/50 my-8">
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-extrabold text-xs tracking-wider uppercase text-amber-400">Visvasa Academy Certificate</span>
              </div>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-gray-400 hover:text-white text-xs font-black py-1 px-3 bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>

            {/* Certificate Frame (Printable/Saveable mockup) */}
            <div className="p-8 sm:p-12 text-center bg-amber-50/20 border-8 border-double border-amber-800/20 rounded-b-3xl relative overflow-hidden text-gray-900">
              {/* Background watermark seals */}
              <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
                <Trophy className="w-64 h-64 text-amber-600" />
              </div>
              <div className="absolute -bottom-16 -left-16 opacity-5 pointer-events-none">
                <Award className="w-72 h-72 text-amber-600" />
              </div>

              {/* Certificate Border decoration */}
              <div className="border border-amber-800/40 p-6 sm:p-10 rounded-xl space-y-6 relative bg-white shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 relative">
                    <Sparkles className="w-8 h-8" />
                    <Award className="w-6 h-6 absolute -bottom-1 -right-1 text-slate-900 fill-amber-400" />
                  </div>
                </div>

                <p className="font-serif italic text-amber-800 text-lg sm:text-xl font-semibold">Certificate of Completion</p>
                
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">This is proudly presented to</p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-slate-800 border-b border-amber-200 pb-2 max-w-sm mx-auto">
                    {spName}
                  </h2>
                </div>

                <p className="text-xs leading-relaxed text-gray-500 font-semibold max-w-md mx-auto">
                  For successfully fulfilling the background audits, code of conduct compliance reviews, safety protocols, and technical assessments required to be recognized as a
                </p>

                <p className="text-sm uppercase tracking-widest font-black text-amber-700 flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-100 py-2.5 px-4 rounded-xl max-w-xs mx-auto">
                  <ShieldCheck className="w-4 h-4" /> Visvasa Verified Partner
                </p>

                {/* Seal and signatures */}
                <div className="pt-6 grid grid-cols-2 gap-8 max-w-md mx-auto text-left border-t border-gray-100">
                  <div>
                    <p className="font-serif italic text-slate-700 font-bold text-xs">Kunal Mittal</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Quality Assurance & Operations</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-slate-800 font-bold text-[10px]">VERIFIED_ID_SP001</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Verification Audit Hash</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
