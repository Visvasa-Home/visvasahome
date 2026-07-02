import { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, User, Calendar, DollarSign, CheckCircle2, XCircle, Navigation } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import {
  getPendingJobs,
  getActiveJobs,
  getCompletedJobs,
  acceptJob,
  declineJob,
  type SPJob
} from '@professional/services/spJobService';

interface SPJobsPageProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}



export const SPJobsPage = ({ onBack, onNavigate }: SPJobsPageProps) => {
  const [pendingJobs, setPendingJobs] = useState<SPJob[]>([]);
  const [activeJobs, setActiveJobs] = useState<SPJob[]>([]);
  const [completedJobs, setCompletedJobs] = useState<SPJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  
  // Uber-like States
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return localStorage.getItem('visvasahome_sp_online') !== 'false';
  });
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Get SP ID dynamically
  const spId = localStorage.getItem('visvasahome_partner_id') || 'SP001';

  useEffect(() => {
    loadJobs();
  }, []);

  // Poll for new jobs automatically to simulate real-time incoming dispatches
  useEffect(() => {
    const poll = setInterval(() => {
      loadJobs();
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    // Update countdown timers every second
    const interval = setInterval(() => {
      const newTimers: { [key: string]: number } = {};
      pendingJobs.forEach(job => {
        const remaining = Math.max(0, Math.floor((new Date(job.expiresAt).getTime() - Date.now()) / 1000));
        newTimers[job.id] = remaining;
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingJobs]);

  // Uber Driver Beep-Beep Loop when a pending job exists
  useEffect(() => {
    if (!isOnline || pendingJobs.length === 0) return;

    let intervalId: any;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const playBeep = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      };

      playBeep();
      intervalId = setInterval(playBeep, 800);
    } catch (e) {
      console.log('Audio autoplay blocked by browser policy');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pendingJobs, isOnline]);

  const loadJobs = async () => {
    try {
      const [pending, active, completed] = await Promise.all([
        getPendingJobs(spId),
        getActiveJobs(spId),
        getCompletedJobs(spId)
      ]);
      setPendingJobs(pending);
      setActiveJobs(active);
      setCompletedJobs(completed);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    localStorage.setItem('visvasahome_sp_online', String(next));
    
    // Play online/offline sonar sound effect
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(next ? 1046.50 : 523.25, ctx.currentTime); // High C6 for online, C5 for offline
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  const handleAcceptJob = async (jobId: string) => {
    const result = await acceptJob(jobId, spId);
    if (result.success) {
      loadJobs();
      onNavigate('sp-job-detail', { jobId });
    }
  };

  const handleDeclineJob = async (jobId: string) => {
    const result = await declineJob(jobId, spId);
    if (result.success) {
      loadJobs();
    }
  };

  const formatTime = (seconds: number): string => {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const JobCard = ({ job, type }: { job: SPJob; type: 'pending' | 'active' | 'completed' }) => {
    const timeRemaining = timers[job.id] || 0;
    const isExpired = timeRemaining === 0 && type === 'pending';

    return (
      <Card className="mb-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-300" onClick={() => onNavigate('sp-job-detail', { jobId: job.id })}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{job.serviceName}</CardTitle>
              <p className="text-xs text-[color:var(--color-text-secondary)] mt-1 uppercase font-bold tracking-wider">{job.serviceCategory}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-emerald-600">₹{job.earnings.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-[color:var(--color-text-secondary)]">
                Payout: ₹{job.earnings - job.commission}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-[color:var(--color-text-secondary)]" />
            <span className="font-semibold text-gray-800">{job.customerName}</span>
            {type !== 'pending' && (
              <Badge className="ml-auto" variant={job.status === 'in-progress' ? 'default' : 'secondary'}>
                {job.status === 'accepted' && 'Accepted'}
                {job.status === 'enroute' && 'En Route'}
                {job.status === 'arrived' && 'Arrived'}
                {job.status === 'in-progress' && 'Working'}
                {job.status === 'completed' && 'Completed'}
              </Badge>
            )}
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[color:var(--color-text-secondary)] mt-0.5" />
            <span className="flex-1 text-xs text-gray-600">{job.customerAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[color:var(--color-text-secondary)]" />
            <span className="text-xs text-gray-600">{formatDateTime(job.scheduledTime)}</span>
          </div>

          {type === 'pending' && (
            <div className="pt-3 border-t border-[color:var(--color-border)]">
              {!isExpired ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-destructive animate-pulse" />
                    <span className={`font-semibold ${timeRemaining < 10 ? 'text-destructive' : ''}`}>
                      {formatTime(timeRemaining)}
                    </span>
                    <span className="text-sm text-[color:var(--color-text-secondary)]">to respond</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeclineJob(job.id);
                      }}
                      variant="outline"
                      className="w-full text-xs font-bold"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptJob(job.id);
                      }}
                      className="w-full text-xs font-bold bg-[#2563EB]"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Badge variant="destructive">Expired</Badge>
                </div>
              )}
            </div>
          )}

          {type === 'active' && (
            <div className="pt-3 border-t border-[color:var(--color-border)]">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('sp-job-detail', { jobId: job.id });
                }}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-xs font-bold text-white py-2"
              >
                Start Job / Map Directions
              </Button>
            </div>
          )}

          {type === 'completed' && job.rating && (
            <div className="pt-3 border-t border-[color:var(--color-border)]">
              <div className="flex items-center justify-between text-sm">
                <span>Customer Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-yellow-600">{job.rating} ⭐</span>
                </div>
              </div>
              {job.review && (
                <p className="text-xs text-[color:var(--color-text-secondary)] mt-2 italic">
                  "{job.review}"
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-gray-500">Loading partner panel...</p>
        </div>
      </div>
    );
  }

  // Find active pending job for Uber full-screen alert overlay
  const activePendingJob = isOnline && pendingJobs.length > 0 ? pendingJobs[0] : null;
  const pendingTimeRemaining = activePendingJob ? (timers[activePendingJob.id] || 0) : 0;

  return (
    <div className="min-h-screen bg-slate-900 pb-20 text-white relative">
      
      {/* ── Header with Uber-Style Switcher ── */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" className="text-gray-400 hover:text-white p-2">
              ← Back
            </Button>
            <div>
              <h1 className="text-lg font-black tracking-wide text-white">Partner Portal</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Uber-Style dispatcher</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleOnline}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 border
              ${isOnline 
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-emerald-500/10' 
                : 'bg-slate-800 border-slate-700 text-gray-400'}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* ── Offline Status Mode Banner ── */}
      {!isOnline && (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 text-gray-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-gray-200">You Are Offline</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              Tap the button above to go Online. While online, you will receive real-time local booking dispatch alerts.
            </p>
            <button
              onClick={handleToggleOnline}
              className="px-8 py-3 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10"
            >
              Go Online Now
            </button>
          </div>
        </div>
      )}

      {/* ── Online List View ── */}
      {isOnline && (
        <div className="max-w-2xl mx-auto px-4 py-6 text-gray-800">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <TabsTrigger value="pending" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-gray-400 text-xs font-bold py-2.5 rounded-xl">
                Pending {pendingJobs.length > 0 && `(${pendingJobs.length})`}
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-gray-400 text-xs font-bold py-2.5 rounded-xl">
                Active {activeJobs.length > 0 && `(${activeJobs.length})`}
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-gray-400 text-xs font-bold py-2.5 rounded-xl">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-0">
              {pendingJobs.length > 0 ? (
                <div className="space-y-4">
                  {pendingJobs.map(job => (
                    <JobCard key={job.id} job={job} type="pending" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-3xl">
                  <div className="relative w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                    <span className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 animate-spin-slow" />
                    </span>
                    <span className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm">Searching for ride requests...</p>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider font-bold">Automatic radar dispatching active</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              {activeJobs.length > 0 ? (
                <div className="space-y-4">
                  {activeJobs.map(job => (
                    <JobCard key={job.id} job={job} type="active" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-3xl">
                  <Calendar className="w-16 h-16 mx-auto text-slate-800 mb-4" />
                  <p className="text-gray-400 font-bold text-sm">No Active Trips</p>
                  <p className="text-xs text-gray-600 mt-1">Trips accepted from the pending radar show up here.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {completedJobs.length > 0 ? (
                <div className="space-y-4">
                  {completedJobs.map(job => (
                    <JobCard key={job.id} job={job} type="completed" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-3xl">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-slate-800 mb-4" />
                  <p className="text-gray-400 font-bold text-sm">No Job History</p>
                  <p className="text-xs text-gray-600 mt-1">Your past completed client payouts show up here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* ── 5. Uber-Style Full-Screen Radar Dispatch Alert Overlay ── */}
      {activePendingJob && pendingTimeRemaining > 0 && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[36px] p-6 space-y-6 shadow-2xl relative overflow-hidden text-center">
            
            {/* Background Radar Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-blue-500/10 rounded-full pointer-events-none animate-ping" />
            
            {/* Header */}
            <div>
              <span className="bg-blue-900/40 border border-blue-800 text-blue-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Incoming Local Request
              </span>
              <h2 className="text-2xl font-black mt-3 text-white leading-tight">
                {activePendingJob.serviceName}
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">
                {activePendingJob.serviceCategory}
              </p>
            </div>

            {/* Simulated mini Map Area */}
            <div className="h-28 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Street Grid */}
                <path d="M 0,20 L 100,20 M 0,50 L 100,50 M 0,80 L 100,80 M 30,0 L 30,100 M 70,0 L 70,100" stroke="#1E293B" strokeWidth="1" />
                {/* Route Path Line */}
                <path d="M 30,80 L 30,50 L 70,50" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="3" className="animate-dash" />
                {/* SP Point */}
                <circle cx="30" cy="80" r="4.5" fill="#10B981" />
                <circle cx="30" cy="80" r="8" fill="none" stroke="#10B981" strokeWidth="1" className="animate-ping" />
                {/* Customer Point */}
                <circle cx="70" cy="50" r="4.5" fill="#EF4444" />
                <text x="66" y="44" fill="#EF4444" fontSize="6" fontWeight="bold">USER</text>
              </svg>
              {/* Floating Address */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-1.5 text-[9px] font-bold text-left text-gray-400">
                <MapPin className="w-3 h-3 text-[#EF4444] shrink-0" />
                <span className="truncate">{activePendingJob.customerAddress}</span>
              </div>
            </div>

            {/* Earnings info */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-left">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estimated Payout</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">₹{activePendingJob.earnings.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right text-[10px] text-gray-400 font-bold space-y-1">
                <p>Dist: <strong className="text-gray-200">1.8 km</strong></p>
                <p>Time: <strong className="text-gray-200">20 mins</strong></p>
              </div>
            </div>

            {/* Radial Accept Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => handleAcceptJob(activePendingJob.id)}
                className="relative w-28 h-28 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-full flex flex-col items-center justify-center gap-1 shadow-2xl active:scale-95 transition-all text-white border-4 border-emerald-950 group"
              >
                {/* Dynamic Ticking SVG Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="56" cy="56" r="50"
                    fill="none" stroke="#064E3B" strokeWidth="4"
                  />
                  <circle
                    cx="56" cy="56" r="50"
                    fill="none" stroke="#34D399" strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - pendingTimeRemaining / 30)}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span className="text-sm font-black tracking-widest uppercase">ACCEPT</span>
                <span className="text-xs font-black font-mono bg-emerald-950 px-2 py-0.5 rounded-full">{pendingTimeRemaining}s</span>
              </button>

              <button
                onClick={() => handleDeclineJob(activePendingJob.id)}
                className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider"
              >
                Decline Request
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};
