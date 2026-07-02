import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Filter, UserCheck, UserX, Star, Phone, Mail, MapPin, Briefcase, Award, Ban, FileText, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';

import { calculateSPRankingScore } from '@booking/services/algorithms';

interface AdminProfessionalsPageProps {
  onBack: () => void;
}

interface Professional {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  location: string;
  rating: number;
  totalJobs: number;
  completionRate: number;
  revenue: string;
  joinedDate: string;
  status: 'Active' | 'Pending' | 'Suspended';
  verified: boolean;
  experience: string;
  experienceYears: number;
  responseTimeMinutes: number;
  skills: string[];
  availability: 'Online' | 'Offline' | 'Busy';
  kycDocType: string;
  kycAgedDays: number;
}

export function AdminProfessionalsPage({ onBack }: AdminProfessionalsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'kyc'>('all');

  // KYC Modal States
  const [verifyingProId, setVerifyingProId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<boolean | null>(null);

  // Mock Professionals Database
  // Professionals Database state with localStorage sync
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    const saved = localStorage.getItem('visvasahome_professionals');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'PRO10234',
        name: 'Amit Sharma',
        phone: '+91-9123456789',
        email: 'amit.sharma@email.com',
        category: 'Plumbing',
        location: 'Jaipur, Rajasthan',
        rating: 4.9,
        totalJobs: 127,
        completionRate: 98,
        revenue: '₹1,24,500',
        joinedDate: '2026-05-10',
        status: 'Active',
        verified: true,
        experience: '8 years',
        experienceYears: 8,
        responseTimeMinutes: 0,
        skills: ['Tap Repair', 'Pipe Fitting', 'Geyser Installation'],
        availability: 'Online',
        kycDocType: 'Aadhaar Card',
        kycAgedDays: 34
      },
      {
        id: 'PRO10235',
        name: 'Meera Patel',
        phone: '+91-9123456788',
        email: 'meera.patel@email.com',
        category: 'Cleaning',
        location: 'Mumbai, Maharashtra',
        rating: 4.8,
        totalJobs: 98,
        completionRate: 96,
        revenue: '₹98,750',
        joinedDate: '2026-05-15',
        status: 'Active',
        verified: true,
        experience: '5 years',
        experienceYears: 5,
        responseTimeMinutes: 0,
        skills: ['Deep Cleaning', 'Home Cleaning', 'Kitchen Cleaning'],
        availability: 'Busy',
        kycDocType: 'Aadhaar Card',
        kycAgedDays: 29
      },
      {
        id: 'PRO10236',
        name: 'Ravi Kumar',
        phone: '+91-9123456787',
        email: 'ravi.kumar@email.com',
        category: 'AC Service',
        location: 'Delhi NCR',
        rating: 4.9,
        totalJobs: 85,
        completionRate: 97,
        revenue: '₹1,12,300',
        joinedDate: '2026-05-01',
        status: 'Active',
        verified: true,
        experience: '10 years',
        experienceYears: 10,
        responseTimeMinutes: 0,
        skills: ['AC Installation', 'AC Repair', 'Gas Charging'],
        availability: 'Online',
        kycDocType: 'PAN Card',
        kycAgedDays: 43
      },
      {
        id: 'PRO10237',
        name: 'Karan Singh',
        phone: '+91-9123456786',
        email: 'karan.singh@email.com',
        category: 'Painting',
        location: 'Jaipur, Rajasthan',
        rating: 4.8,
        totalJobs: 76,
        completionRate: 94,
        revenue: '₹87,600',
        joinedDate: '2026-05-20',
        status: 'Active',
        verified: true,
        experience: '6 years',
        experienceYears: 6,
        responseTimeMinutes: 0,
        skills: ['Interior Painting', 'Exterior Painting', 'Texture Paint'],
        availability: 'Offline',
        kycDocType: 'Aadhaar Card',
        kycAgedDays: 24
      },
      {
        id: 'PRO10238',
        name: 'Suresh Yadav',
        phone: '+91-9123456785',
        email: 'suresh.yadav@email.com',
        category: 'Electrical',
        location: 'Pune, Maharashtra',
        rating: 4.6,
        totalJobs: 52,
        completionRate: 89,
        revenue: '₹65,200',
        joinedDate: '2026-06-08',
        status: 'Pending',
        verified: false,
        experience: '4 years',
        experienceYears: 4,
        responseTimeMinutes: 0,
        skills: ['Wiring', 'Switch Repair', 'Fan Installation'],
        availability: 'Offline',
        kycDocType: 'Work License & PAN',
        kycAgedDays: 5
      },
      {
        id: 'PRO10239',
        name: 'Priya Malhotra',
        phone: '+91-9123456784',
        email: 'priya.m@email.com',
        category: 'Painting',
        location: 'Chennai, Tamil Nadu',
        rating: 4.5,
        totalJobs: 28,
        completionRate: 92,
        revenue: '₹45,800',
        joinedDate: '2026-05-22',
        status: 'Suspended',
        verified: true,
        experience: '7 years',
        experienceYears: 7,
        responseTimeMinutes: 0,
        skills: ['Interior Painting', 'Exterior Painting', 'Waterproofing'],
        availability: 'Offline',
        kycDocType: 'Aadhaar Card',
        kycAgedDays: 22
      },
      {
        id: 'PRO10240',
        name: 'Mohit Verma',
        phone: '+91-9123456783',
        email: 'mohit.verma@email.com',
        category: 'Carpentry',
        location: 'Bengaluru, Karnataka',
        rating: 4.7,
        totalJobs: 31,
        completionRate: 91,
        revenue: '₹38,900',
        joinedDate: '2026-06-03',
        status: 'Pending',
        verified: false,
        experience: '5 years',
        experienceYears: 5,
        responseTimeMinutes: 0,
        skills: ['Furniture Assembly', 'Door Repair', 'Cabinet Work'],
        availability: 'Online',
        kycDocType: 'Aadhaar Card',
        kycAgedDays: 10
      }
    ];
  });

  const adminRole = localStorage.getItem('visvasahome_admin_role') || 'super_admin';

  const checkWritePermission = () => {
    if (adminRole === 'support_agent') {
      alert("Permission Denied: Support Agent roles are read-only. Only Super Admins or Operations Managers can modify database records.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    localStorage.setItem('visvasahome_professionals', JSON.stringify(professionals));
  }, [professionals]);

  const handleToggleAvailability = (id: string) => {
    if (!checkWritePermission()) return;
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === id) {
          const statuses: ('Online' | 'Offline' | 'Busy')[] = ['Online', 'Busy', 'Offline'];
          const nextIndex = (statuses.indexOf(p.availability) + 1) % statuses.length;
          return { ...p, availability: statuses[nextIndex] };
        }
        return p;
      })
    );
  };

  const handleOpenKyc = (id: string) => {
    if (!checkWritePermission()) return;
    setVerifyingProId(id);
    setScanning(false);
    setScanResult(null);
  };

  const handleScanDoc = () => {
    if (!checkWritePermission()) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanResult(true);
    }, 1800);
  };

  const handleApproveKyc = () => {
    if (!checkWritePermission()) return;
    if (!verifyingProId) return;
    setProfessionals(prev =>
      prev.map(p => (p.id === verifyingProId ? { ...p, status: 'Active', verified: true } : p))
    );
    setVerifyingProId(null);
    alert('Professional verified successfully! Status is updated to Active.');
  };

  const handleRejectKyc = () => {
    if (!checkWritePermission()) return;
    if (!verifyingProId) return;
    setProfessionals(prev =>
      prev.map(p => (p.id === verifyingProId ? { ...p, status: 'Suspended', verified: false } : p))
    );
    setVerifyingProId(null);
    alert('Professional registration rejected. Status set to Suspended.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Suspended': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAvailabilityColor = (avail: Professional['availability']) => {
    switch (avail) {
      case 'Online': return 'bg-emerald-500';
      case 'Busy': return 'bg-amber-500';
      case 'Offline': return 'bg-gray-400';
    }
  };

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pro.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pro.phone.includes(searchQuery);
      
      let matchesTab = true;
      if (activeTab === 'kyc') {
        matchesTab = pro.status === 'Pending';
      }
      
      const matchesStatus = statusFilter === 'all' || pro.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || pro.category === categoryFilter;
      
      return matchesSearch && matchesTab && matchesStatus && matchesCategory;
    });
  }, [professionals, searchQuery, statusFilter, categoryFilter, activeTab]);

  const categories = [...new Set(professionals.map(p => p.category))];
  const pendingCount = professionals.filter(p => p.status === 'Pending').length;

  const verifyingPro = professionals.find(p => p.id === verifyingProId);

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Manage Professionals</h1>
            <p className="text-sm text-gray-500">View performance stats, toggles availability, and manage document verification queues</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => { setActiveTab('all'); setStatusFilter('all'); }}
            className={`pb-2.5 font-semibold text-sm transition-all ${
              activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Registered Workers
          </button>
          <button
            onClick={() => { setActiveTab('kyc'); setStatusFilter('Pending'); }}
            className={`pb-2.5 font-semibold text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'kyc' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KYC Verification Queue
            {pendingCount > 0 && (
              <Badge className="bg-amber-500 text-white hover:bg-amber-600 px-1.5 py-0.5 text-[10px] rounded-full">
                {pendingCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-white">
                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeTab !== 'kyc' && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending Verification</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Professionals List */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {filteredProfessionals.map((pro) => (
            <Card key={pro.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200 bg-white">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Profile details */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-sm">
                      {pro.name.charAt(0)}
                    </div>
                    {/* Live Availability dot */}
                    <div
                      title={`Availability: ${pro.availability}`}
                      className={`absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-xs ${getAvailabilityColor(
                        pro.availability
                      )}`}
                      onClick={() => handleToggleAvailability(pro.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg text-gray-900">{pro.name}</h3>
                      {pro.verified && (
                        <span title="Verified Professional">
                          <Award className="w-5 h-5 text-[#2563EB]" />
                        </span>
                      )}
                      <Badge className="bg-blue-50 text-blue-700 border-blue-250 text-xs font-bold">
                        Rank Score: {calculateSPRankingScore({
                          rating: pro.rating,
                          jobsCompleted: pro.totalJobs,
                          completionRate: pro.completionRate / 100,
                          experienceYears: pro.experienceYears,
                          responseTimeMinutes: pro.responseTimeMinutes
                        })}/100
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${getStatusColor(pro.status)} border text-xs`}>
                        {pro.status}
                      </Badge>
                      <span className="text-xs text-gray-400">ID: {pro.id}</span>
                      {pro.status === 'Pending' && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] py-0">
                          Aged {pro.kycAgedDays} days
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{pro.phone}</span></div>
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{pro.email}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{pro.location}</span></div>
                    </div>
                  </div>
                </div>

                {/* Center: Performance metrics */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category & Experience</p>
                    <p className="font-bold text-gray-900">{pro.category}</p>
                    <p className="text-xs text-gray-600">{pro.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rating & Jobs</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{pro.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600">{pro.totalJobs} jobs completed</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Availability Status</p>
                    <button
                      onClick={() => handleToggleAvailability(pro.id)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5 active:scale-95"
                    >
                      {pro.availability} <span className="text-[10px] text-gray-400">(Change)</span>
                    </button>
                    <p className="text-xs text-gray-600">Success rate: {pro.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
                    <p className="font-bold text-gray-900">{pro.revenue}</p>
                    <p className="text-xs text-gray-600">Platform commission deducted</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 min-w-[150px]">
                  {pro.status === 'Pending' ? (
                    <Button
                      size="sm"
                      onClick={() => handleOpenKyc(pro.id)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-1 text-xs"
                    >
                      <FileText className="w-4 h-4" /> Review KYC
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      View Profile Details
                    </Button>
                  )}

                  {pro.status === 'Active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!checkWritePermission()) return;
                        if (confirm(`Suspend worker ${pro.name}?`)) {
                          setProfessionals(prev => prev.map(p => p.id === pro.id ? { ...p, status: 'Suspended' } : p));
                        }
                      }}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 text-xs flex items-center justify-center gap-1"
                    >
                      <Ban className="w-4 h-4" /> Suspend
                    </Button>
                  )}

                  {pro.status === 'Suspended' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!checkWritePermission()) return;
                        setProfessionals(prev => prev.map(p => p.id === pro.id ? { ...p, status: 'Active', verified: true } : p));
                        alert('Worker account reactivated.');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs flex items-center justify-center gap-1"
                    >
                      <UserCheck className="w-4 h-4" /> Activate
                    </Button>
                  )}
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-semibold mb-2">Skills & Expertise Rate Cards</p>
                <div className="flex flex-wrap gap-2">
                  {pro.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50/50 text-[#2563EB] border-blue-200 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <Card className="p-12 text-center border-gray-200 bg-white">
            <UserX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600">Try adjusting your filters or checking different tabs</p>
          </Card>
        )}
      </div>

      {/* KYC Document Verification Modal */}
      {verifyingProId && verifyingPro && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-xl p-6 bg-white shadow-2xl relative border border-gray-200 rounded-2xl">
            <button
              onClick={() => setVerifyingProId(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              &times; Close
            </button>
            <div className="border-b border-gray-150 pb-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900">Document Authenticity Scanner</h3>
              <p className="text-xs text-gray-500">Checking credentials for {verifyingPro.name} ({verifyingPro.id})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Document Info */}
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Submitted Document</p>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> {verifyingPro.kycDocType}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Aged In Verification Queue</p>
                  <p className="text-sm font-bold text-gray-800">
                    Submitted {verifyingPro.kycAgedDays} days ago
                  </p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Experience Claimed</p>
                  <p className="text-sm font-bold text-gray-800">{verifyingPro.experience}</p>
                </div>
              </div>

              {/* Document scan result */}
              <div className="border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-gray-50/50">
                {scanning ? (
                  <div className="space-y-3">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-gray-700">Analyzing Face Embeddings & OCR...</p>
                  </div>
                ) : scanResult === null ? (
                  <div className="space-y-3">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                    <Button onClick={handleScanDoc} size="sm" className="bg-[#2563EB] text-white">
                      Start In-App Scanner
                    </Button>
                    <p className="text-[10px] text-gray-400">Triggers authenticity & face checks</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-green-700">
                    <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                    <p className="text-xs font-extrabold">AUTHENTICITY MATCH: PASS</p>
                    <div className="text-[10px] text-gray-500 font-semibold space-y-0.5">
                      <p>OCR Name Match: 98%</p>
                      <p>Face Match Score: 95%</p>
                      <p>Government ID Check: Valid</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-150 pt-4 mt-4">
              <Button
                onClick={handleApproveKyc}
                disabled={scanning || scanResult === null}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-10"
              >
                Approve & Onboard Partner
              </Button>
              <Button
                onClick={handleRejectKyc}
                disabled={scanning}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-10"
              >
                Reject Registration
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
