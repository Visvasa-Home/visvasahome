import { useState, useEffect } from 'react';
import { MapPin, Phone, User, Clock, DollarSign, Navigation, Camera, FileText, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import { Badge } from '@shared/ui/badge';
import { Alert, AlertDescription } from '@shared/ui/alert';
import {
  startJob,
  completeJob,
  getNavigationUrl,
  getJobById,
  acceptJob,
  declineJob,
  setJobEnroute,
  setJobArrived,
  type SPJob
} from '@professional/services/spJobService';

interface SPJobDetailPageProps {
  jobId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const SPJobDetailPage = ({ jobId, onBack, onNavigate }: SPJobDetailPageProps) => {
  const [job, setJob] = useState<SPJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [startOTP, setStartOTP] = useState('');
  const [completeOTP, setCompleteOTP] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const partnerId = localStorage.getItem('visvasahome_partner_id') || 'SP001';

  // Uber-like Map progress
  const [mapProgress, setMapProgress] = useState(0);
  const [simulatedDirections, setSimulatedDirections] = useState('Standby - start ride to navigate');

  // Compute live professional position coordinates along simulated streets
  const getBikeCoords = () => {
    if (mapProgress <= 0) return { x: 15, y: 85 };
    if (mapProgress >= 100) return { x: 85, y: 25 };

    if (mapProgress < 40) {
      const t = mapProgress / 40;
      return { x: 15 + t * 35, y: 85 };
    } else if (mapProgress < 80) {
      const t = (mapProgress - 40) / 40;
      return { x: 50, y: 85 - t * 60 };
    } else {
      const t = (mapProgress - 80) / 20;
      return { x: 50 + t * 35, y: 25 };
    }
  };

  const bikeCoords = getBikeCoords();

  useEffect(() => {
    if (!job) return;

    if (job.status !== 'enroute') {
      if (job.status === 'accepted') {
        setMapProgress(0);
        setSimulatedDirections('Route loaded: 2.8 km to customer location. Tap Start Ride.');
      } else if (job.status === 'arrived' || job.status === 'in-progress' || job.status === 'completed') {
        setMapProgress(100);
        setSimulatedDirections('Arrived at customer doorstep.');
      }
      return;
    }

    // Initialize progress at 5% when enroute begins
    setMapProgress(5);
    setSimulatedDirections('Head straight on MG Road toward Vaishali Circle');

    const interval = setInterval(() => {
      setMapProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setSimulatedDirections('You have arrived! Meet the client and ask for the Start OTP.');
          return 100;
        }

        // Live turn-by-turn directions matching coordinates
        if (next < 40) {
          setSimulatedDirections('Travelling on MG Road: Keep straight (1.2 km)');
        } else if (next < 60) {
          setSimulatedDirections('Turn left at Vaishali Circle toward lane 4 (500m)');
        } else if (next < 80) {
          setSimulatedDirections('Lane 4: Slow down, prepare to stop (200m)');
        } else {
          setSimulatedDirections('Arriving shortly: Customer house is on your left (50m)');
        }
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [job?.status]);

  // Fetch job details by ID dynamically from database
  useEffect(() => {
    const fetchJob = async (showLoading = false) => {
      if (showLoading) setLoading(true);
      setNotFound(false);
      try {
        const data = await getJobById(jobId);
        if (data) {
          // Sync state, avoiding resetting state variables unnecessarily
          setJob(prevJob => {
            if (!prevJob || prevJob.status !== data.status) {
              return data;
            }
            return prevJob;
          });
          // Set initial time left if pending
          if (data.status === 'pending' && data.expiresAt) {
            const remaining = Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000));
            setTimeLeft(remaining);
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        setNotFound(true);
      } finally {
        if (showLoading) setLoading(false);
      }
    };
    
    fetchJob(true);

    // Dynamic database polling for real-time two-way sync with customer view
    const interval = setInterval(() => {
      fetchJob(false);
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  // Handle countdown timer for pending jobs
  useEffect(() => {
    if (!job || job.status !== 'pending') return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(job.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleAutoDecline();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [job]);

  const handleAutoDecline = async () => {
    setError('Job request expired and has been returned to the pool.');
    await declineJob(jobId, partnerId);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleAcceptJobClick = async () => {
    if (!job) return;
    setError('');
    setSuccess('');
    const result = await acceptJob(jobId, partnerId);
    if (result.success && result.job) {
      setSuccess('Job accepted successfully! Navigate to customer location to start service.');
      setJob({ ...result.job });
    } else {
      setError(result.job ? 'Failed to accept job' : 'Job request has expired.');
    }
  };

  const handleDeclineJobClick = async () => {
    if (!job) return;
    setError('');
    setSuccess('');
    const result = await declineJob(jobId, partnerId);
    if (result.success) {
      setSuccess('Job request returned to the pool.');
      setTimeout(() => {
        onBack();
      }, 1500);
    } else {
      setError('Failed to decline job.');
    }
  };

  const handleStartRide = async () => {
    if (!job) return;
    setError('');
    setSuccess('');
    const result = await setJobEnroute(job.id);
    if (result.success) {
      setSuccess('Ride started! Customer is now tracking your route.');
      setJob({ ...job, status: 'enroute' });
      // Trigger navigation directions
      const url = getNavigationUrl(job.customerLocation);
      window.open(url, '_blank');
    } else {
      setError('Failed to start ride.');
    }
  };

  const handleMarkArrived = async () => {
    if (!job) return;
    setError('');
    setSuccess('');
    const result = await setJobArrived(job.id);
    if (result.success) {
      setSuccess('Marked as arrived at doorstep. Ask the customer for the Start OTP.');
      setJob({ ...job, status: 'arrived' });
    } else {
      setError('Failed to mark as arrived.');
    }
  };

  const handleStartJob = async () => {
    if (!job) return;

    setError('');
    setSuccess('');

    const result = await startJob(jobId, startOTP);
    if (result.success) {
      setSuccess('Job started successfully!');
      setJob({ ...job, status: 'in-progress', startTime: new Date() });
      setStartOTP('');
    } else {
      setError(result.message || 'Invalid OTP');
    }
  };

  const handleCompleteJob = async () => {
    if (!job) return;

    setError('');
    setSuccess('');

    const result = await completeJob(jobId, completeOTP);
    if (result.success) {
      setSuccess('Job completed! Invoice generated.');
      setJob({ ...job, status: 'completed', completeTime: new Date() });
      setTimeout(() => {
        onNavigate('sp-earnings');
      }, 2000);
    } else {
      setError(result.message || 'Invalid OTP');
    }
  };

  const handleNavigate = () => {
    if (!job) return;
    const url = getNavigationUrl(job.customerLocation);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[color:var(--color-text-secondary)] text-sm font-semibold">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center mt-12">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Job Not Found</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            The job with ID <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-bold">{jobId}</span> could not be found or does not exist.
          </p>
          <Button onClick={onBack} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl py-3 font-bold">
            Back to My Jobs
          </Button>
        </div>
      </div>
    );
  }

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] pb-20">
      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button onClick={onBack} variant="ghost" className="mb-2">
            ← Back to Jobs
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{job.serviceName}</h1>
              <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
                Job ID: {job.id}
              </p>
            </div>
            <Badge variant={
              job.status === 'accepted' ? 'secondary' :
              job.status === 'enroute' ? 'default' :
              job.status === 'arrived' ? 'default' :
              job.status === 'in-progress' ? 'default' :
              'outline'
            }>
              {job.status === 'pending' && 'Pending Request'}
              {job.status === 'accepted' && 'Accepted'}
              {job.status === 'enroute' && 'En Route'}
              {job.status === 'arrived' && 'Arrived'}
              {job.status === 'in-progress' && 'In Progress'}
              {job.status === 'completed' && 'Completed'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* ── Uber Driver-Style Navigation Map HUD ── */}
        {['accepted', 'enroute', 'arrived', 'in-progress'].includes(job.status) && (
          <Card className="overflow-hidden border-2 border-slate-800 bg-slate-950 text-white">
            <CardHeader className="bg-slate-900 border-b border-slate-800/60 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-black tracking-widest text-blue-400 uppercase flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 animate-pulse" /> Live Dispatch Navigation
                </CardTitle>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-wider">Jaipur City Grid</p>
              </div>
              <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 font-bold">
                {mapProgress}% trip progress
              </Badge>
            </CardHeader>
            <CardContent className="p-0 relative">
              {/* Map Canvas */}
              <div className="h-56 relative bg-slate-950">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Street Roads Grid */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#1E293B" strokeWidth="1.5" />
                  <line x1="0" y1="85" x2="100" y2="85" stroke="#1E293B" strokeWidth="1.5" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#1E293B" strokeWidth="1.5" />
                  <line x1="15" y1="0" x2="15" y2="100" stroke="#1E293B" strokeWidth="0.8" opacity="0.4" />
                  <line x1="85" y1="0" x2="85" y2="100" stroke="#1E293B" strokeWidth="0.8" opacity="0.4" />

                  {/* Highlighted Route Path */}
                  <path
                    d="M 15,85 L 50,85 L 50,25 L 85,25"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 2"
                    className="animate-dash"
                  />

                  {/* Starting Depot Marker (Green) */}
                  <circle cx="15" cy="85" r="4.5" fill="#10B981" />
                  <circle cx="15" cy="85" r="9" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />

                  {/* Customer House Marker (Red) */}
                  <circle cx="85" cy="25" r="5" fill="#EF4444" />
                  <circle cx="85" cy="25" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" />

                  {/* Moving Technician Icon (Motorcycle / Bike) */}
                  <g transform={`translate(${bikeCoords.x - 3}, ${bikeCoords.y - 3})`}>
                    <circle cx="3" cy="3" r="3" fill="#2563EB" />
                    <circle cx="3" cy="3" r="5" fill="none" stroke="#60A5FA" strokeWidth="1" className="animate-ping" />
                  </g>
                </svg>

                {/* Floating GPS Indicators */}
                <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[9px] font-bold text-gray-400 space-y-0.5">
                  <p>Dist: <strong className="text-gray-200">2.8 km</strong></p>
                  <p>ETA: <strong className="text-blue-400">~8 min</strong></p>
                </div>
              </div>

              {/* Live Guidance HUD Banner */}
              <div className="p-3 bg-blue-950/40 border-t border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-lg text-white font-extrabold text-xs">
                  ➔
                </div>
                <p className="text-xs font-black text-gray-200 leading-normal">{simulatedDirections}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[color:var(--color-text-secondary)]" />
              <div>
                <p className="font-medium">{job.customerName}</p>
                <p className="text-sm text-[color:var(--color-text-secondary)]">{job.customerPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[color:var(--color-text-secondary)] mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Service Address</p>
                <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
                  {job.customerAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[color:var(--color-text-secondary)]" />
              <div>
                <p className="font-medium">Scheduled Time</p>
                <p className="text-sm text-[color:var(--color-text-secondary)]">
                  {formatDateTime(job.scheduledTime)}
                </p>
              </div>
            </div>

            <Button
              onClick={handleNavigate}
              className="w-full mt-4"
              variant="outline"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Navigate to Customer Location
            </Button>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[color:var(--color-text-secondary)]">Category</p>
              <p className="font-medium">{job.serviceCategory}</p>
            </div>

            <div>
              <p className="text-sm text-[color:var(--color-text-secondary)]">Service</p>
              <p className="font-medium">{job.serviceName}</p>
            </div>

            <div className="pt-4 border-t border-[color:var(--color-border)]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[color:var(--color-text-secondary)]">Service Amount</span>
                <span className="font-semibold">₹{job.earnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-[color:var(--color-text-secondary)]">Platform Commission (20%)</span>
                <span className="text-sm text-[color:var(--color-text-secondary)]">- ₹{job.commission.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[color:var(--color-border)]">
                <span className="font-semibold">Your Earnings</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{(job.earnings - job.commission).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Actions */}
        {job.status === 'pending' && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                Action Required: Pending Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center">
                <p className="text-sm text-[color:var(--color-text-secondary)] font-medium">Respond within</p>
                <p className={`text-4xl font-black my-2 ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-amber-600'}`}>
                  {timeLeft}s
                </p>
                <p className="text-[11px] text-gray-400">
                  Failing to respond will automatically return this job to the matching pool.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleDeclineJobClick}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold py-3 rounded-xl"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={handleAcceptJobClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept Job
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {job.status === 'accepted' && (
          <Card className="border-blue-200 bg-blue-50/20">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600 animate-pulse" />
                Go to Customer Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[color:var(--color-text-secondary)] leading-relaxed">
                You have accepted this request. Please start your ride to the customer's doorstep. The customer will track your live location and ETA.
              </p>
              <Button
                onClick={handleStartRide}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Start Ride (Go En-Route)
              </Button>
            </CardContent>
          </Card>
        )}

        {job.status === 'enroute' && (
          <Card className="border-indigo-200 bg-indigo-50/20">
            <CardHeader>
              <CardTitle className="text-indigo-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600 animate-bounce" />
                En-Route to Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[color:var(--color-text-secondary)] leading-relaxed">
                You are currently travelling towards the customer. Click below if you need navigation directions.
              </p>
              
              <div className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                  <Navigation className="w-4 h-4" /> Live Map Route Active
                </div>
                <Button
                  onClick={handleNavigate}
                  variant="outline"
                  className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold"
                >
                  Open Google Maps Directions
                </Button>
              </div>

              <Button
                onClick={handleMarkArrived}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200"
              >
                Mark as Arrived (At Doorstep)
              </Button>
            </CardContent>
          </Card>
        )}

        {job.status === 'arrived' && (
          <Card className="border-emerald-200 bg-emerald-50/10">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Arrived at Doorstep
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[color:var(--color-text-secondary)] leading-relaxed">
                Please request the **Start OTP** from the customer's screen to begin the service.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800">Enter Start OTP</label>
                <Input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={startOTP}
                  onChange={(e) => setStartOTP(e.target.value)}
                  maxLength={4}
                  className="text-center text-2xl font-bold tracking-widest border-emerald-300 focus-visible:ring-emerald-500 py-6 rounded-xl"
                />
              </div>

              <Button
                onClick={handleStartJob}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg"
                disabled={startOTP.length !== 4}
              >
                Verify & Start Work
              </Button>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <span className="text-sm text-emerald-800 font-medium">Demo Start OTP:</span>
                <span className="font-mono bg-white border border-emerald-300 px-3 py-1 rounded-lg text-emerald-700 font-bold tracking-wider">
                  {job.startOTP}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {job.status === 'in-progress' && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-900">
                  Job started at {job.startTime && formatDateTime(job.startTime)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Service Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about the service completed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Photos (Optional)</label>
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Before/After Photos
                </Button>
              </div>

              <div className="pt-4 border-t border-[color:var(--color-border)] space-y-2">
                <label className="text-sm font-medium">Enter Completion OTP</label>
                <Input
                  type="text"
                  placeholder="Enter 4-digit OTP from customer"
                  value={completeOTP}
                  onChange={(e) => setCompleteOTP(e.target.value)}
                  maxLength={4}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button
                onClick={handleCompleteJob}
                className="w-full"
                disabled={completeOTP.length !== 4}
              >
                <FileText className="w-4 h-4 mr-2" />
                Complete Job & Generate Invoice
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  <strong>Demo OTP:</strong> {job.completeOTP} (for testing)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {job.status === 'completed' && (
          <Card>
            <CardHeader>
              <CardTitle>Job Completed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="font-semibold text-green-900 mb-2">
                  Job completed successfully!
                </p>
                <p className="text-sm text-green-700">
                  Invoice generated and sent to customer
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-[color:var(--color-text-secondary)]">Started at</span>
                  <span className="text-sm">{job.startTime && formatDateTime(job.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[color:var(--color-text-secondary)]">Completed at</span>
                  <span className="text-sm">{job.completeTime && formatDateTime(job.completeTime)}</span>
                </div>
              </div>

              <Button
                onClick={() => onNavigate('sp-earnings')}
                className="w-full"
              >
                View Earnings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
