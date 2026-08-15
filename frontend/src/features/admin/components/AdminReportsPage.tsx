import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Zap, 
  UserCheck, 
  MapPin, 
  Activity, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  HelpCircle, 
  RefreshCw, 
  Navigation,
  Sparkles,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@shared/ui/tabs';

// Import algorithms from the engine
import { 
  calculateSurgeMultiplier, 
  calculateSPRankingScore, 
  calculateBayesianCancellationRate, 
  matchProfessionalsRiskAdjusted, 
  solveCombinatorialVRP, 
  verifyFaceEmbeddings, 
  detectMetricAnomaly,
  getDistance
} from '@booking/services/algorithms';

interface AdminReportsPageProps {
  onBack: () => void;
}

export function AdminReportsPage({ onBack }: AdminReportsPageProps) {
  const [activeTab, setActiveTab] = useState('surge');

  // Stats for the top of the dashboard
  const stats = [
    { label: 'Total Revenue', value: '₹12.4L', change: '+18.7%', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Bookings This Month', value: '1,247', change: '+12.5%', icon: Calendar, color: 'text-[#2563EB]', bgColor: 'bg-blue-50' },
    { label: 'New Customers', value: '342', change: '+23.1%', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Growth Rate', value: '24.8%', change: '+5.2%', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  ];

  // ============================================================================
  // 1. SURGE PRICING SIMULATOR STATE & LOGIC
  // ============================================================================
  const [surgeDemand, setSurgeDemand] = useState(15);
  const [surgeSupply, setSurgeSupply] = useState(8);
  const [surgeBookingTime, setSurgeBookingTime] = useState("18:00");
  const [surgeGamma, setSurgeGamma] = useState(0.5);
  const [surgeCategoryMultiplier, setSurgeCategoryMultiplier] = useState(1.0);

  const calculatedSurge = calculateSurgeMultiplier({
    bookingTime: surgeBookingTime,
    activeBookingsInArea: surgeDemand,
    availableSpsInArea: surgeSupply,
    categoryBaseMultiplier: surgeCategoryMultiplier
  }, surgeGamma);

  // Math steps for visualization
  const ratio = surgeSupply > 0 ? (surgeDemand / surgeSupply) : 0;
  const isPeakTime = (() => {
    const [h, m] = surgeBookingTime.split(':').map(Number);
    const mins = h * 60 + (m || 0);
    return (mins >= 450 && mins <= 630) || (mins >= 1050 && mins <= 1230);
  })();

  // ============================================================================
  // 2. BAYESIAN MATCH SIMULATOR STATE & LOGIC
  // ============================================================================
  const [matchCategory, setMatchCategory] = useState("Plumbing");
  const [customerOffsetLat, setCustomerOffsetLat] = useState(0);
  const [customerOffsetLng, setCustomerOffsetLng] = useState(0);

  // Default coordinates (Jaipur Central)
  const baseLat = 26.9124;
  const baseLng = 75.7873;
  const customerLat = baseLat + customerOffsetLat;
  const customerLng = baseLng + customerOffsetLng;

  // Mock Professionals (strictly NO beauty, NO massage)
  const [mockPros, setMockPros] = useState([
    {
      id: 'PRO-PLUM-1',
      name: 'Amit Sharma',
      latitude: 26.9180,
      longitude: 75.7890,
      categories: ['Plumbing'],
      rating: 4.9,
      jobsCompleted: 120,
      completionRate: 0.98,
      experienceYears: 8,
      responseTimeMinutes: 0,
      cancellations: 2,
      bookingsCount: 125,
      isVerified: true,
      isActive: true,
      maxDistanceKm: 15,
      availability: [{ dayOfWeek: new Date().getDay(), startTime: '06:00', endTime: '22:00' }]
    },
    {
      id: 'PRO-PLUM-2',
      name: 'Ravi Kumar',
      latitude: 26.9050,
      longitude: 75.7720,
      categories: ['Plumbing'],
      rating: 4.8,
      jobsCompleted: 80,
      completionRate: 0.96,
      experienceYears: 10,
      responseTimeMinutes: 0,
      cancellations: 7,
      bookingsCount: 90,
      isVerified: true,
      isActive: true,
      maxDistanceKm: 15,
      availability: [{ dayOfWeek: new Date().getDay(), startTime: '06:00', endTime: '22:00' }]
    },
    {
      id: 'PRO-PLUM-3',
      name: 'Rajesh Gupta',
      latitude: 26.9200,
      longitude: 75.7600,
      categories: ['Plumbing'],
      rating: 4.4,
      jobsCompleted: 45,
      completionRate: 0.88,
      experienceYears: 5,
      responseTimeMinutes: 0,
      cancellations: 12,
      bookingsCount: 60,
      isVerified: true,
      isActive: true,
      maxDistanceKm: 15,
      availability: [{ dayOfWeek: new Date().getDay(), startTime: '06:00', endTime: '22:00' }]
    },
    {
      id: 'PRO-CLEAN-1',
      name: 'Sunita Rao',
      latitude: 26.9150,
      longitude: 75.7950,
      categories: ['Cleaning'],
      rating: 4.7,
      jobsCompleted: 95,
      completionRate: 0.95,
      experienceYears: 6,
      responseTimeMinutes: 0,
      cancellations: 1,
      bookingsCount: 98,
      isVerified: true,
      isActive: true,
      maxDistanceKm: 12,
      availability: [{ dayOfWeek: new Date().getDay(), startTime: '06:00', endTime: '22:00' }]
    },
    {
      id: 'PRO-ELEC-1',
      name: 'Suresh Yadav',
      latitude: 26.8950,
      longitude: 75.7800,
      categories: ['Electrical'],
      rating: 4.6,
      jobsCompleted: 52,
      completionRate: 0.90,
      experienceYears: 4,
      responseTimeMinutes: 0,
      cancellations: 4,
      bookingsCount: 58,
      isVerified: true,
      isActive: true,
      maxDistanceKm: 20,
      availability: [{ dayOfWeek: new Date().getDay(), startTime: '06:00', endTime: '22:00' }]
    },
    {
      id: 'PRO-RENO-1',
      name: 'Vikram Singh',
      latitude: 26.9300,
      longitude: 75.8100,
      categories: ['Renovations'],
      rating: 4.9,
      jobsCompleted: 140,
      completionRate: 0.99,
      experienceYears: 12,
      responseTimeMinutes: 0,
      cancellations: 0,
      bookingsCount: 140,
      isVerified: true,
      isActive: true,
      maxDistanceKm: 25,
      availability: [{ dayOfWeek: new Date().getDay(), startTime: '06:00', endTime: '22:00' }]
    }
  ]);

  const [selectedProId, setSelectedProId] = useState(mockPros[0].id);

  // Find and update a mock pro in the local sandbox state
  const handleProStatChange = (statKey: string, val: number) => {
    setMockPros(prev => prev.map(pro => {
      if (pro.id === selectedProId) {
        return { ...pro, [statKey]: val };
      }
      return pro;
    }));
  };

  const currentSelectedPro = mockPros.find(p => p.id === selectedProId) || mockPros[0];

  // Perform risk adjusted matching
  const matchingResults = matchProfessionalsRiskAdjusted({
    customerLat,
    customerLng,
    serviceCategory: matchCategory,
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: "12:00",
    professionals: mockPros,
    bookings: [] // No colliding bookings in simulator
  });

  // ============================================================================
  // 3. VRP ROUTING STATE & LOGIC
  // ============================================================================
  const [vrpJobs, setVrpJobs] = useState([
    { id: '1', name: 'Leakage Fix (Vaishali)', latitude: 26.9244, longitude: 75.7723, enabled: true },
    { id: '2', name: 'Drainage Clear (Malviya)', latitude: 26.8874, longitude: 75.8223, enabled: true },
    { id: '3', name: 'Geyser Install (C-Scheme)', latitude: 26.9104, longitude: 75.7923, enabled: true },
    { id: '4', name: 'Wiring Repair (Mansarovar)', latitude: 26.8674, longitude: 75.7623, enabled: true }
  ]);

  const [newJobName, setNewJobName] = useState('');
  const [newJobLatOffset, setNewJobLatOffset] = useState('0.01');
  const [newJobLngOffset, setNewJobLngOffset] = useState('-0.01');

  const activeVrpJobs = vrpJobs.filter(j => j.enabled);
  const vrpResult = solveCombinatorialVRP(baseLat, baseLng, activeVrpJobs);

  // Compute unoptimized sequential route distance for comparison
  const calculateSeqDistance = () => {
    let dist = 0;
    let currLat = baseLat;
    let currLng = baseLng;
    for (const job of activeVrpJobs) {
      dist += getDistance(currLat, currLng, job.latitude, job.longitude);
      currLat = job.latitude;
      currLng = job.longitude;
    }
    if (activeVrpJobs.length > 0) {
      dist += getDistance(currLat, currLng, baseLat, baseLng);
    }
    return Number(dist.toFixed(2));
  };
  const sequentialDistance = calculateSeqDistance();
  const vrpSavings = sequentialDistance > 0 
    ? Math.max(0, Number(((1 - vrpResult.totalDistanceKm / sequentialDistance) * 100).toFixed(1))) 
    : 0;

  // SVG dimensions for map routing visualization
  const mapW = 400;
  const mapH = 300;
  const LAT_MIN = 26.85;
  const LAT_MAX = 26.95;
  const LNG_MIN = 75.74;
  const LNG_MAX = 75.84;

  const getXY = (lat: number, lng: number) => {
    const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * mapW;
    const y = mapH - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * mapH;
    return { x: Math.max(10, Math.min(mapW - 10, x)), y: Math.max(10, Math.min(mapH - 10, y)) };
  };

  const baseXY = getXY(baseLat, baseLng);

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobName) return;
    const lat = baseLat + parseFloat(newJobLatOffset || '0');
    const lng = baseLng + parseFloat(newJobLngOffset || '0');
    const newId = (vrpJobs.length + 1).toString();
    setVrpJobs(prev => [...prev, {
      id: newId,
      name: newJobName,
      latitude: lat,
      longitude: lng,
      enabled: true
    }]);
    setNewJobName('');
  };

  const handleToggleJob = (id: string) => {
    setVrpJobs(prev => prev.map(j => j.id === id ? { ...j, enabled: !j.enabled } : j));
  };

  const handleRemoveJob = (id: string) => {
    setVrpJobs(prev => prev.filter(j => j.id !== id));
  };

  // ============================================================================
  // 4. Z-SCORE ANOMALY DETECTOR STATE & LOGIC
  // ============================================================================
  const [observedMetric, setObservedMetric] = useState(16);
  const [predictedBaseline, setPredictedBaseline] = useState(6);
  const [metricSigma, setMetricSigma] = useState(3.0);
  const [metricKappa, setMetricKappa] = useState(2.0);

  const anomalyResult = detectMetricAnomaly(observedMetric, predictedBaseline, metricSigma, metricKappa);

  // ============================================================================
  // 5. BIOMETRIC KYC SIMULATOR STATE & LOGIC
  // ============================================================================
  // We represent facial embeddings using 5 sliders
  const [refEmbedding, setRefEmbedding] = useState([0.75, 0.45, -0.12, 0.60, 0.85]);
  const [liveSlider0, setLiveSlider0] = useState(0.72);
  const [liveSlider1, setLiveSlider1] = useState(0.48);
  const [liveSlider2, setLiveSlider2] = useState(-0.10);
  const [liveSlider3, setLiveSlider3] = useState(0.58);
  const [liveSlider4, setLiveSlider4] = useState(0.82);
  const [faceThreshold, setFaceThreshold] = useState(0.85);

  const liveEmbedding = [liveSlider0, liveSlider1, liveSlider2, liveSlider3, liveSlider4];
  const faceVerifyResult = verifyFaceEmbeddings(refEmbedding, liveEmbedding, faceThreshold);

  // Reset to match reference embedding
  const syncEmbeddings = () => {
    setLiveSlider0(refEmbedding[0]);
    setLiveSlider1(refEmbedding[1]);
    setLiveSlider2(refEmbedding[2]);
    setLiveSlider3(refEmbedding[3]);
    setLiveSlider4(refEmbedding[4]);
  };

  // Tweak reference embedding when selecting a mock professional
  const handleSelectFacePro = (name: string) => {
    if (name === 'Amit') {
      setRefEmbedding([0.80, 0.30, -0.25, 0.70, 0.90]);
      setLiveSlider0(0.78); setLiveSlider1(0.32); setLiveSlider2(-0.28); setLiveSlider3(0.68); setLiveSlider4(0.88);
    } else if (name === 'Ravi') {
      setRefEmbedding([0.40, 0.85, 0.15, -0.30, 0.50]);
      setLiveSlider0(0.42); setLiveSlider1(0.82); setLiveSlider2(0.18); setLiveSlider3(-0.35); setLiveSlider4(0.48);
    } else {
      setRefEmbedding([0.60, 0.50, 0.05, 0.20, 0.75]);
      setLiveSlider0(0.58); setLiveSlider1(0.55); setLiveSlider2(0.00); setLiveSlider3(0.25); setLiveSlider4(0.70);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Upper Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Algorithms Sandbox</h1>
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-semibold flex gap-1 items-center">
                  <Sparkles className="w-3.5 h-3.5" /> Core Engine v2.0
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Tune mathematical pricing, risk matching routing, anomaly, and biometric models</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                // Reset states to default values
                setSurgeDemand(15);
                setSurgeSupply(8);
                setSurgeGamma(0.5);
                setSurgeBookingTime("18:00");
                setSurgeCategoryMultiplier(1.0);
                setCustomerOffsetLat(0);
                setCustomerOffsetLng(0);
                setObservedMetric(16);
                setPredictedBaseline(6);
                setMetricSigma(3.0);
                setMetricKappa(2.0);
                syncEmbeddings();
              }}
              variant="outline" 
              className="flex gap-2 items-center text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4" /> Reset Variables
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Content Area */}
      <div className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
        {/* Quick Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-5 border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-950">{stat.value}</p>
                  <span className="text-green-600 text-xs font-semibold flex items-center gap-0.5 mt-1">
                    {stat.change} vs last month
                  </span>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.bgColor}`}><Icon className={`w-6 h-6 ${stat.color}`} /></div>
              </Card>
            );
          })}
        </div>

        {/* Dynamic Sandbox Simulator Controls */}
        <Card className="border-gray-200 shadow-sm overflow-hidden bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-100 bg-gray-50/70 p-3">
              <TabsList className="grid w-full grid-cols-5 bg-gray-200/50 p-1 rounded-xl h-auto">
                <TabsTrigger value="surge" className="py-2.5 rounded-lg flex items-center gap-2 data-[state=active]:shadow-sm">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Surge Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="matching" className="py-2.5 rounded-lg flex items-center gap-2 data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Risk Matching</span>
                </TabsTrigger>
                <TabsTrigger value="vrp" className="py-2.5 rounded-lg flex items-center gap-2 data-[state=active]:shadow-sm">
                  <Navigation className="w-4 h-4" />
                  <span className="hidden sm:inline">VRP Routing</span>
                </TabsTrigger>
                <TabsTrigger value="anomaly" className="py-2.5 rounded-lg flex items-center gap-2 data-[state=active]:shadow-sm">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Anomaly Detection</span>
                </TabsTrigger>
                <TabsTrigger value="biometrics" className="py-2.5 rounded-lg flex items-center gap-2 data-[state=active]:shadow-sm">
                  <Fingerprint className="w-4 h-4" />
                  <span className="hidden sm:inline">Biometric KYC</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: SURGE PRICING SIMULATOR */}
            <TabsContent value="surge" className="p-6 focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" /> Log-Ratio Surge Simulator
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Adjust supply and demand levels in the active micro-market cell.</p>
                  </div>

                  <div className="space-y-5 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    {/* Demand Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Micro-Area Demand ($D$)</label>
                        <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded text-xs">
                          {surgeDemand} Active Bookings
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={surgeDemand} 
                        onChange={(e) => setSurgeDemand(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Supply Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Micro-Area Supply ($S$)</label>
                        <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded text-xs">
                          {surgeSupply} Active Providers
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        value={surgeSupply} 
                        onChange={(e) => setSurgeSupply(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Elasticity Gamma Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Price Elasticity Coefficient ($\gamma$)</label>
                        <span className="text-gray-800 font-mono text-xs">{surgeGamma.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.5" 
                        step="0.05"
                        value={surgeGamma} 
                        onChange={(e) => setSurgeGamma(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <p className="text-[11px] text-gray-400">Controls the steepness of price escalation based on supply deficits.</p>
                    </div>

                    {/* Booking Time Dropdown */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Booking Schedule Time</label>
                        <select 
                          value={surgeBookingTime}
                          onChange={(e) => setSurgeBookingTime(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="06:00">06:00 AM (Early Off-peak)</option>
                          <option value="09:00">09:00 AM (Morning Peak)</option>
                          <option value="13:00">01:00 PM (Mid-day)</option>
                          <option value="18:00">06:00 PM (Evening Peak)</option>
                          <option value="23:00">11:00 PM (Late Night)</option>
                        </select>
                      </div>

                      {/* Category Base Multiplier */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Category Tier Markup</label>
                        <select 
                          value={surgeCategoryMultiplier}
                          onChange={(e) => setSurgeCategoryMultiplier(parseFloat(e.target.value))}
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="1.0">Standard Rate (1.0x)</option>
                          <option value="1.15">Premium Tier (1.15x)</option>
                          <option value="1.3">Emergency Order (1.30x)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Engine Results */}
                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8 pt-6 lg:pt-0 space-y-6">
                  <div className="text-center bg-gray-50 border border-gray-200/60 p-6 rounded-2xl flex flex-col items-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Surge Multiplier</span>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
                      <span className="text-5xl font-black text-gray-950 tracking-tight z-10">
                        {calculatedSurge.multiplier.toFixed(2)}x
                      </span>
                    </div>
                    <Badge className="mt-3.5 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 flex gap-1 items-center px-3 py-1 font-semibold">
                      {calculatedSurge.multiplier > 1.2 ? <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600 animate-bounce" /> : null}
                      {calculatedSurge.reason}
                    </Badge>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs space-y-3.5 shadow-md">
                    <h4 className="font-bold text-blue-400 border-b border-slate-800 pb-1.5 flex justify-between">
                      <span>MATH EXECUTION GRAPH</span>
                      <span className="text-[10px] text-slate-400">log_surge_multiplier.ts</span>
                    </h4>
                    <div className="space-y-2 text-slate-300">
                      <div>
                        <span className="text-slate-400">// Elasticity Variable Formulation:</span>
                        <br />
                        <span className="text-green-400">Demand ($D$)</span> = {surgeDemand} bookings | <span className="text-blue-400">Supply ($S$)</span> = {surgeSupply} pros
                      </div>
                      <div>
                        <span className="text-slate-400">// 1. Peak Time Multiplier Check ({surgeBookingTime}):</span>
                        <br />
                        <span className="text-purple-300">Boost</span> = {isPeakTime ? "+0.20 (Peak Hour Active)" : "0.00 (Off-Peak Hour)"}
                      </div>
                      <div>
                        <span className="text-slate-400">// 2. Dynamic Log-Ratio ($\max(0, \gamma \ln(D / S))$):</span>
                        <br />
                        Ratio = {ratio > 0 ? ratio.toFixed(2) : 'Supply Empty'}x | LogRatio = {ratio > 1 ? Math.log(ratio).toFixed(4) : '0.0000'}
                        <br />
                        <span className="text-blue-300">{"$\\Delta_{surge}$"}</span> = {surgeSupply <= 0 ? '0.60 (Deficit)' : Math.max(0, surgeGamma * Math.log(ratio)).toFixed(4)}
                      </div>
                      <div>
                        <span className="text-slate-400">// 3. Tier & Cap Bounds:</span>
                        <br />
                        Base = 1.0 | Tier Markup = {surgeCategoryMultiplier}x
                        <br />
                        Sum = (1.0 + {isPeakTime ? "0.20" : "0.00"} + {surgeSupply <= 0 ? "0.60" : Math.max(0, surgeGamma * Math.log(ratio)).toFixed(2)}) * {surgeCategoryMultiplier} = {((1.0 + (isPeakTime ? 0.2 : 0) + (surgeSupply <= 0 ? 0.6 : Math.max(0, surgeGamma * Math.log(ratio)))) * surgeCategoryMultiplier).toFixed(2)}x
                        <br />
                        <span className="text-blue-400 font-bold">Capped Output</span> = <span className="text-blue-400 font-bold underline">{calculatedSurge.multiplier.toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: BAYESIAN MATCH SIMULATOR */}
            <TabsContent value="matching" className="p-6 focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Controls (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-500" /> Bayesian Risk Ranker
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Adjust provider metrics to watch ranking scores recalculate.</p>
                  </div>

                  <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase">Service Category Selection</label>
                      <select 
                        value={matchCategory}
                        onChange={(e) => setMatchCategory(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                      >
                        <option value="Plumbing">Plumbing Services</option>
                        <option value="Cleaning">Home Cleaning</option>
                        <option value="AC Service">AC Service & Repair</option>
                        <option value="Electrical">Electrical Repairs</option>
                        <option value="Painting">Wall Painting</option>
                        <option value="Renovations">Renovations & Masonry</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase">Customer Lat/Lng Coordinates</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400">Lat Offset</label>
                          <input 
                            type="number" 
                            step="0.005"
                            value={customerOffsetLat}
                            onChange={(e) => setCustomerOffsetLat(parseFloat(e.target.value) || 0)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400">Lng Offset</label>
                          <input 
                            type="number" 
                            step="0.005"
                            value={customerOffsetLng}
                            onChange={(e) => setCustomerOffsetLng(parseFloat(e.target.value) || 0)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded bg-white"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Calculated Location: {customerLat.toFixed(4)}, {customerLng.toFixed(4)}</p>
                    </div>

                    <div className="border-t border-gray-200 my-4 pt-3">
                      <label className="text-xs font-bold text-gray-700 uppercase flex gap-1 items-center">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Tweak Professional Stats
                      </label>
                      <select 
                        value={selectedProId}
                        onChange={(e) => setSelectedProId(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-200 rounded-lg text-xs bg-white"
                      >
                        {mockPros.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.categories.join(',')})</option>
                        ))}
                      </select>

                      <div className="mt-3.5 space-y-3">
                        {/* Rating Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Rating Rating:</span>
                            <span className="font-semibold text-gray-800">{currentSelectedPro.rating.toFixed(1)} ★</span>
                          </div>
                          <input 
                            type="range" min="1.0" max="5.0" step="0.1"
                            value={currentSelectedPro.rating} 
                            onChange={(e) => handleProStatChange('rating', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 accent-indigo-600 cursor-pointer"
                          />
                        </div>

                        {/* Cancellations Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Cancellations:</span>
                            <span className="font-semibold text-gray-800">{currentSelectedPro.cancellations} jobs</span>
                          </div>
                          <input 
                            type="range" min="0" max="25"
                            value={currentSelectedPro.cancellations} 
                            onChange={(e) => handleProStatChange('cancellations', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 accent-indigo-600 cursor-pointer"
                          />
                        </div>

                        {/* Total Bookings Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Total Bookings Count:</span>
                            <span className="font-semibold text-gray-800">{currentSelectedPro.bookingsCount} jobs</span>
                          </div>
                          <input 
                            type="range" min="1" max="150"
                            value={currentSelectedPro.bookingsCount} 
                            onChange={(e) => handleProStatChange('bookingsCount', Math.max(currentSelectedPro.cancellations + 1, parseInt(e.target.value)))}
                            className="w-full h-1.5 bg-gray-200 accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Results Table (8 columns) */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-gray-800">Risk-Adjusted Ranking Results</h4>
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                        Formula: S_final = S_base * (1 - theta_cancel)
                      </Badge>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase">
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">Professional</th>
                            <th className="py-3 px-4 text-center">Distance</th>
                            <th className="py-3 px-4 text-center">Base score {"($S_{base}$)"}</th>
                            <th className="py-3 px-4 text-center">Bayesian Cancel {"($\\theta$)"}</th>
                            <th className="py-3 px-4 text-center font-bold text-gray-950">Risk-Adjusted {"($S_{final}$)"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 text-sm">
                          {matchingResults.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-500 font-medium bg-gray-50/50">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                                No matching active providers found in micro-range for category "{matchCategory}".
                              </td>
                            </tr>
                          ) : (
                            matchingResults.map((m, index) => (
                              <tr 
                                key={m.professionalId} 
                                className={`hover:bg-indigo-50/20 transition-colors ${index === 0 ? 'bg-indigo-50/40 border-l-4 border-l-indigo-600' : ''}`}
                              >
                                <td className="py-3.5 px-4 font-bold text-gray-700">
                                  {index === 0 ? '🏆 1' : index + 1}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-gray-900">{m.name}</div>
                                  <div className="text-[10px] text-gray-400">{m.professionalId}</div>
                                </td>
                                <td className="py-3.5 px-4 text-center text-gray-600 font-medium">
                                  {m.distanceKm.toFixed(1)} km
                                </td>
                                <td className="py-3.5 px-4 text-center text-gray-600">
                                  {m.baseScore.toFixed(1)}
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono text-xs text-red-600 bg-red-50/30">
                                  {(m.bayesianCancelRate * 100).toFixed(1)}%
                                </td>
                                <td className="py-3.5 px-4 text-center font-bold text-indigo-700 text-base">
                                  {m.riskAdjustedScore}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bayesian explanation */}
                  <div className="mt-6 bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs space-y-2.5">
                    <h4 className="font-bold text-indigo-400 border-b border-slate-800 pb-1.5">
                      BAYESIAN SHRINKAGE PRIOR IMPLEMENTATION
                    </h4>
                    <p className="text-slate-300 font-sans">
                      Standard division calculations are vulnerable to low-sample sizes. A provider with 1 job completed who cancels it looks like 100% cancellation rate (unmatchable).
                      We smooth this using a Beta-Binomial prior (α = 1.0, β = 19.0) representing a 5% system average.
                    </p>
                    <div className="text-slate-400 space-y-1">
                      <div>
                        {"Formula: θ_cancel = (Cancellations + α) / (Bookings + α + β)"}
                      </div>
                      <div>
                        {"For Selected Provider ("}
                        <span className="text-white font-bold">{currentSelectedPro.name}</span>
                        {"):"}
                      </div>
                      <div className="text-yellow-300">
                        {"θ_cancel = ("}
                        {currentSelectedPro.cancellations}
                        {" + 1) / ("}
                        {currentSelectedPro.bookingsCount}
                        {" + 20) = "}
                        <span className="text-green-400 font-bold">
                          {calculateBayesianCancellationRate(currentSelectedPro.cancellations, currentSelectedPro.bookingsCount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: VRP ROUTE OPTIMIZATION */}
            <TabsContent value="vrp" className="p-6 focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Job Coordinator (5 Columns) */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-emerald-500" /> VRP 2-Opt Local Search Planner
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Solve the combinatorial Vehicle Routing Problem for daily jobs.</p>
                  </div>

                  {/* Add Custom Job Form */}
                  <form onSubmit={handleAddJob} className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-gray-700 uppercase">Inject Custom Job Coordinate</h4>
                    <div className="space-y-2.5">
                      <Input 
                        placeholder="Job Location Name (e.g. Bani Park)"
                        value={newJobName}
                        onChange={(e) => setNewJobName(e.target.value)}
                        className="text-xs h-8 bg-white border-gray-300"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-gray-500">Lat Offset (-0.05 to +0.05)</label>
                          <input 
                            type="number" step="0.005" min="-0.05" max="0.05"
                            value={newJobLatOffset}
                            onChange={(e) => setNewJobLatOffset(e.target.value)}
                            className="w-full p-1 border border-gray-300 text-xs rounded bg-white"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-gray-500">Lng Offset (-0.05 to +0.05)</label>
                          <input 
                            type="number" step="0.005" min="-0.05" max="0.05"
                            value={newJobLngOffset}
                            onChange={(e) => setNewJobLngOffset(e.target.value)}
                            className="w-full p-1 border border-gray-300 text-xs rounded bg-white"
                          />
                        </div>
                      </div>
                      <Button type="submit" size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs h-8 gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Inject Job Node
                      </Button>
                    </div>
                  </form>

                  {/* Job List Checklist */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Available Nodes to Tour</label>
                    <div className="max-h-56 overflow-y-auto space-y-2 border border-gray-150 rounded-xl p-3 bg-white">
                      {vrpJobs.map(job => (
                        <div key={job.id} className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={job.enabled}
                              onChange={() => handleToggleJob(job.id)}
                              className="w-4.5 h-4.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <div>
                              <span className="font-semibold text-gray-800">{job.name}</span>
                              <span className="block text-[9px] text-gray-400">Lat: {job.latitude.toFixed(4)} | Lng: {job.longitude.toFixed(4)}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveJob(job.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SVG Visualizer Canvas (7 Columns) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-600 uppercase block">Daily Route Map Visualizer</span>
                      <span className="text-xs text-gray-400">Jaipur Coordinates Grid Scale</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        Greedy + 2-Opt Local Search
                      </Badge>
                    </div>
                  </div>

                  {/* SVG map card */}
                  <Card className="p-4 bg-slate-950 border-slate-800 shadow-md relative overflow-hidden flex items-center justify-center">
                    <svg width={mapW} height={mapH} className="border border-slate-900 bg-slate-950 rounded-xl">
                      {/* Grid background lines */}
                      {Array.from({ length: 9 }).map((_, i) => {
                        const x = ((i + 1) / 10) * mapW;
                        const y = ((i + 1) / 10) * mapH;
                        return (
                          <React.Fragment key={i}>
                            <line x1={x} y1={0} x2={x} y2={mapH} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 4" />
                            <line x1={0} y1={y} x2={mapW} y2={y} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 4" />
                          </React.Fragment>
                        );
                      })}

                      {/* Draw optimized path lines */}
                      {(() => {
                        if (vrpResult.orderedJobs.length === 0) return null;
                        const points = [
                          baseXY, 
                          ...vrpResult.orderedJobs.map(j => getXY(j.latitude, j.longitude)),
                          baseXY
                        ];
                        return points.map((p, idx) => {
                          if (idx === points.length - 1) return null;
                          const next = points[idx + 1];
                          return (
                            <React.Fragment key={idx}>
                              {/* Glowing trace path */}
                              <line 
                                x1={p.x} y1={p.y} x2={next.x} y2={next.y} 
                                stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" 
                              />
                              {/* Animated directional dashes */}
                              <line 
                                x1={p.x} y1={p.y} x2={next.x} y2={next.y} 
                                stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 8"
                                opacity="0.9"
                              />
                            </React.Fragment>
                          );
                        });
                      })()}

                      {/* Central Base Station node */}
                      <circle cx={baseXY.x} cy={baseXY.y} r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                      <text x={baseXY.x + 10} y={baseXY.y + 4} fill="#93c5fd" fontSize="9" fontWeight="bold">Pro Home Base</text>

                      {/* Job Nodes */}
                      {activeVrpJobs.map((job) => {
                        const { x, y } = getXY(job.latitude, job.longitude);
                        const tourIdx = vrpResult.orderedJobs.findIndex(j => j.id === job.id);
                        return (
                          <g key={job.id} className="cursor-pointer group">
                            <circle cx={x} cy={y} r="6.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                            {/* Tour sequence badge */}
                            <circle cx={x} cy={y - 10} r="7" fill="#10b981" />
                            <text x={x} y={y - 7} fill="#ffffff" fontSize="8.5" textAnchor="middle" fontWeight="bold">
                              {tourIdx !== -1 ? tourIdx + 1 : '?'}
                            </text>
                            {/* Job tooltip */}
                            <text x={x + 10} y={y + 3} fill="#cbd5e1" fontSize="8" fontWeight="medium">
                              {job.name.split(' ')[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </Card>

                  {/* Route efficiency comparatives */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-gray-150 p-3.5 rounded-xl text-center">
                      <span className="block text-[10px] text-gray-500 font-semibold uppercase">Sequential (Original)</span>
                      <span className="text-xl font-bold text-gray-600">{sequentialDistance.toFixed(1)} km</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-center">
                      <span className="block text-[10px] text-emerald-600 font-bold uppercase">Optimized Tour (VRP)</span>
                      <span className="text-xl font-extrabold text-emerald-700">{vrpResult.totalDistanceKm.toFixed(1)} km</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-150 p-3.5 rounded-xl text-center">
                      <span className="block text-[10px] text-blue-600 font-bold uppercase">Vehicle Mileage Saved</span>
                      <Badge className="bg-blue-600 text-white font-black animate-pulse">{vrpSavings}% Saving</Badge>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] space-y-1">
                    <span className="text-emerald-400 font-bold">// 2-Opt Local Search Tour Refinement:</span>
                    <br />
                    <span>Sequence: {vrpResult.routeSequence.map((node, i) => `${node === "Base Station" ? "Base" : node.split(' ')[0]}`).join(' → ') || 'No locations'}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: Z-SCORE ANOMALY DETECTOR */}
            <TabsContent value="anomaly" className="p-6 focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-500" /> Statistical Z-Score Anomaly Detector
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Determine system performance health outliers based on cancellation rates.</p>
                  </div>

                  <div className="space-y-5 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    {/* Observed Value Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Observed Cancellations/Hour</label>
                        <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {observedMetric} cases
                        </span>
                      </div>
                      <input 
                        type="range" min="0" max="30"
                        value={observedMetric} 
                        onChange={(e) => setObservedMetric(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>

                    {/* Predicted Baseline Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Predicted Baseline Rate {"($\\hat{Y}_t$)"}</label>
                        <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {predictedBaseline} cases
                        </span>
                      </div>
                      <input 
                        type="range" min="0" max="20"
                        value={predictedBaseline} 
                        onChange={(e) => setPredictedBaseline(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>

                    {/* Standard Deviation Sigma */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Standard Deviation Deviation ($\sigma$)</label>
                        <span className="font-mono text-xs text-gray-800">{metricSigma.toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" min="1.0" max="8.0" step="0.5"
                        value={metricSigma} 
                        onChange={(e) => setMetricSigma(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>

                    {/* Tolerance Threshold Kappa */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label className="font-semibold text-gray-700">Sensitivity Threshold Factor ($\kappa$)</label>
                        <span className="font-mono text-xs text-gray-800">{metricKappa.toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" min="1.0" max="3.0" step="0.2"
                        value={metricKappa} 
                        onChange={(e) => setMetricKappa(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Math Alert Outputs */}
                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8 pt-6 lg:pt-0 space-y-6">
                  {/* Dynamic Alert Banner */}
                  <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
                    anomalyResult.isAnomaly 
                      ? 'bg-red-50 border-red-200 text-red-900 animate-pulse' 
                      : 'bg-green-50 border-green-200 text-green-900'
                  }`}>
                    {anomalyResult.isAnomaly ? (
                      <ShieldAlert className="w-12 h-12 text-red-600 mb-3" />
                    ) : (
                      <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
                    )}
                    <span className="text-xs uppercase font-bold tracking-wider mb-1">
                      System Operational Health Status
                    </span>
                    <h3 className="text-xl font-black mb-1">
                      {anomalyResult.isAnomaly ? "CRITICAL OUTLIER DETECTED" : "NORMAL PERFORMANCE HEALTH"}
                    </h3>
                    <p className="text-xs max-w-xs mt-1.5 opacity-90">
                      {anomalyResult.isAnomaly 
                        ? `Hourly cancellations exceed deviation threshold factor (${anomalyResult.zScore}σ >= ${metricKappa}σ). Auto-escalating booking dispatch settings.` 
                        : `Current hourly metrics fall within normal deviation margins (Z = ${anomalyResult.zScore}σ).`
                      }
                    </p>
                  </div>

                  {/* Historical comparison bars */}
                  <div className="space-y-2 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Hourly Cancel Vol Trend Simulator</span>
                    <div className="flex justify-between items-end h-28 pt-2">
                      {/* Normal points */}
                      {[4, 5, 3, 6, 5, 4].map((v, i) => (
                        <div key={i} className="flex flex-col items-center w-8">
                          <div className="bg-slate-400 w-4 rounded-t" style={{ height: `${(v / 30) * 80}px` }}></div>
                          <span className="text-[9px] text-gray-400 mt-1 font-mono">{v}</span>
                        </div>
                      ))}
                      {/* Current observed slider point */}
                      <div className="flex flex-col items-center w-10">
                        <div className={`w-6 rounded-t transition-all ${anomalyResult.isAnomaly ? 'bg-red-500 shadow-md shadow-red-200' : 'bg-green-500'}`} style={{ height: `${(observedMetric / 30) * 80}px` }}></div>
                        <span className="text-[10px] font-bold text-gray-800 mt-1 font-mono">{observedMetric}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs">
                    <span className="text-red-400">// Z-Score Evaluation Engine:</span>
                    <br />
                    <span>Z-Score = (Observed - Predicted) / Sigma</span>
                    <br />
                    <span>Z = ({observedMetric} - {predictedBaseline}) / {metricSigma} = <span className="font-bold underline text-yellow-300">{anomalyResult.zScore}σ</span></span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 5: BIOMETRIC KYC SIMULATOR */}
            <TabsContent value="biometrics" className="p-6 focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                        <Fingerprint className="w-5 h-5 text-purple-600" /> Biometric Facial Verification Simulator
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Simulate cosine similarity matching between ID card embeddings and live selfies.</p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="outline" className="text-xs flex-1 border-gray-300" onClick={() => handleSelectFacePro('Amit')}>
                        Load Amit's ID profile
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="text-xs flex-1 border-gray-300" onClick={() => handleSelectFacePro('Ravi')}>
                        Load Ravi's ID profile
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="text-xs flex-1 border-gray-300" onClick={syncEmbeddings}>
                        Sync Perfect Match
                      </Button>
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-3.5">
                      <span className="text-xs font-bold text-gray-700 uppercase block">Tweak Selfie Embedding Vector Features</span>
                      
                      {/* Eyebrow Arch feature */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                          <span>Eyebrow Spacing / Arch</span>
                          <span className="font-mono">{liveSlider0.toFixed(2)}</span>
                        </div>
                        <input type="range" min="-1.0" max="1.0" step="0.05" value={liveSlider0} onChange={(e) => setLiveSlider0(parseFloat(e.target.value))} className="w-full h-1.5 accent-purple-600 cursor-pointer bg-gray-200 rounded" />
                      </div>

                      {/* Eye Spacing feature */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                          <span>Iris Distance</span>
                          <span className="font-mono">{liveSlider1.toFixed(2)}</span>
                        </div>
                        <input type="range" min="-1.0" max="1.0" step="0.05" value={liveSlider1} onChange={(e) => setLiveSlider1(parseFloat(e.target.value))} className="w-full h-1.5 accent-purple-600 cursor-pointer bg-gray-200 rounded" />
                      </div>

                      {/* Nose Bridge height */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                          <span>Nose Bridge Height</span>
                          <span className="font-mono">{liveSlider2.toFixed(2)}</span>
                        </div>
                        <input type="range" min="-1.0" max="1.0" step="0.05" value={liveSlider2} onChange={(e) => setLiveSlider2(parseFloat(e.target.value))} className="w-full h-1.5 accent-purple-600 cursor-pointer bg-gray-200 rounded" />
                      </div>

                      {/* Jawline Width */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                          <span>Jawline Width</span>
                          <span className="font-mono">{liveSlider3.toFixed(2)}</span>
                        </div>
                        <input type="range" min="-1.0" max="1.0" step="0.05" value={liveSlider3} onChange={(e) => setLiveSlider3(parseFloat(e.target.value))} className="w-full h-1.5 accent-purple-600 cursor-pointer bg-gray-200 rounded" />
                      </div>

                      {/* Lip Thickness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                          <span>Lip Symmetry thickness</span>
                          <span className="font-mono">{liveSlider4.toFixed(2)}</span>
                        </div>
                        <input type="range" min="-1.0" max="1.0" step="0.05" value={liveSlider4} onChange={(e) => setLiveSlider4(parseFloat(e.target.value))} className="w-full h-1.5 accent-purple-600 cursor-pointer bg-gray-200 rounded" />
                      </div>

                      {/* Threshold Slider */}
                      <div className="border-t border-gray-150 pt-3 space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>Security Match Threshold</span>
                          <span className="font-mono text-purple-700">{(faceThreshold * 100).toFixed(0)}% Similarity</span>
                        </div>
                        <input type="range" min="0.5" max="0.95" step="0.05" value={faceThreshold} onChange={(e) => setFaceThreshold(parseFloat(e.target.value))} className="w-full h-1.5 accent-purple-700 cursor-pointer bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Outputs */}
                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8 pt-6 lg:pt-0 space-y-6">
                  {/* Glowing Match Indicator */}
                  <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
                    faceVerifyResult.isMatch 
                      ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-sm' 
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="relative flex items-center justify-center mb-3">
                      <Fingerprint className={`w-14 h-14 ${faceVerifyResult.isMatch ? 'text-purple-600' : 'text-red-500'}`} />
                      {faceVerifyResult.isMatch ? (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                      ) : (
                        <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-white">
                          <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                      )}
                    </div>
                    
                    <span className="text-xs uppercase font-bold tracking-wider mb-1">
                      Verification Analysis Result
                    </span>
                    <h3 className="text-2xl font-black mb-1">
                      {(faceVerifyResult.similarity * 100).toFixed(1)}% Similarity
                    </h3>
                    <Badge className={`mt-2 font-bold px-3 py-1 text-xs border ${
                      faceVerifyResult.isMatch 
                        ? 'bg-purple-100 text-purple-800 border-purple-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {faceVerifyResult.isMatch ? "SECURITY CHECKS PASSED" : "KYC ID PROFILE MISMATCH"}
                    </Badge>
                    <p className="text-[11px] max-w-xs mt-3 opacity-80">
                      {faceVerifyResult.isMatch 
                        ? "Facial biometrics verified. Professional is authorized to accept user bookings." 
                        : "Embeddings distance exceeds limit! Service provider verification suspended."
                      }
                    </p>
                  </div>

                  {/* Embedding Comparison charts */}
                  <div className="space-y-3.5 bg-gray-50 border border-gray-200 p-4 rounded-xl font-mono text-[10px] text-gray-600">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Vector Embeddings Matrix Comparison</span>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <span className="w-16 font-semibold">ID Matrix:</span>
                        <div className="flex-1 flex gap-0.5 items-center bg-gray-200 h-4 rounded px-1 overflow-hidden text-slate-900 font-mono">
                          {refEmbedding.map((val, idx) => (
                            <span key={idx} className="flex-1 text-center bg-slate-400 text-[8px] text-white rounded-xs py-0.5 font-bold">
                              {val.toFixed(2)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="w-16 font-semibold">Selfie Vector:</span>
                        <div className="flex-1 flex gap-0.5 items-center bg-gray-200 h-4 rounded px-1 overflow-hidden text-slate-900 font-mono">
                          {liveEmbedding.map((val, idx) => (
                            <span key={idx} className="flex-1 text-center bg-purple-500 text-[8px] text-white rounded-xs py-0.5 font-bold">
                              {val.toFixed(2)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs">
                    <span className="text-purple-400">// Cosine Similarity Equation:</span>
                    <br />
                    <span>Sim = (e1 • e2) / (||e1|| * ||e2||)</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
