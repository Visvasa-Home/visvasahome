import { ArrowLeft, User, Calendar, DollarSign, Star, CheckCircle, Clock, XCircle, Phone, MapPin, Briefcase, Loader2, LayoutGrid, GraduationCap, Award } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { useState, useEffect, useCallback } from 'react';
import { getProfessionalByUserId, getUserBookings } from '@core/db/database';
import { Professional, Booking, isSupabaseConfigured } from '@core/db/supabaseClient';
import { getPendingJobs, getActiveJobs, getCompletedJobs, acceptJob, declineJob } from '@professional/services/spJobService';

interface ProfessionalDashboardProps {
  onBack: () => void;
  professionalPhone: string;
}

interface ProfessionalDisplay {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  experience: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  earnings: number;
  verified: boolean;
  availability: string;
}

interface BookingDisplay {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  amount: number;
}

// Mock professional data fallback
const getMockProfessional = (): ProfessionalDisplay => ({
  id: 'prof_001',
  name: 'Rajesh Kumar',
  phone: '+919876543210',
  email: 'rajesh.kumar@example.com',
  category: 'Plumbing Contractor',
  experience: '8 years',
  rating: 4.8,
  totalJobs: 156,
  completedJobs: 148,
  earnings: 245000,
  verified: true,
  availability: 'Available',
});

const getMockBookings = (): BookingDisplay[] => [
  {
    id: 'book_001',
    customerName: 'Amit Sharma',
    customerPhone: '+919123456789',
    service: 'Tap Repair & Installation',
    address: 'C-23, Malviya Nagar, Jaipur',
    scheduledDate: '2026-05-12',
    scheduledTime: '10:00 AM',
    status: 'confirmed',
    amount: 599,
  },
  {
    id: 'book_002',
    customerName: 'Priya Singh',
    customerPhone: '+919876512340',
    service: 'Bathroom Plumbing',
    address: 'B-45, Vaishali Nagar, Jaipur',
    scheduledDate: '2026-05-13',
    scheduledTime: '2:00 PM',
    status: 'pending',
    amount: 1299,
  },
  {
    id: 'book_003',
    customerName: 'Rahul Verma',
    customerPhone: '+919012345678',
    service: 'Water Leak Detection',
    address: 'A-12, Mansarovar, Jaipur',
    scheduledDate: '2026-05-10',
    scheduledTime: '11:00 AM',
    status: 'completed',
    amount: 799,
  },
];

export function ProfessionalDashboard({ onBack, professionalPhone }: ProfessionalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [professional, setProfessional] = useState<ProfessionalDisplay | null>(null);
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionalData = useCallback(async () => {
    try {
      // 1. Look up in localStorage first (simulated database)
      const savedPros = localStorage.getItem('visvasahome_professionals');
      const professionalsList = savedPros ? JSON.parse(savedPros) : [];
      
      const cleanPhone = (p: string) => p.replace(/[^\d+]/g, '');
      const matched = professionalsList.find(
        (p: any) => cleanPhone(p.phone) === cleanPhone(professionalPhone)
      );

      let currentProId = 'SP001';
      let proDetails: ProfessionalDisplay;

      if (matched) {
        currentProId = matched.id;
        let parsedEarnings = 0;
        if (matched.revenue) {
          const revStr = String(matched.revenue).replace(/[^\d.]/g, '');
          if (String(matched.revenue).includes('L')) {
            parsedEarnings = parseFloat(revStr) * 100000;
          } else if (String(matched.revenue).includes('K')) {
            parsedEarnings = parseFloat(revStr) * 1000;
          } else {
            parsedEarnings = parseFloat(revStr) || 0;
          }
        }

        proDetails = {
          id: matched.id,
          name: matched.name,
          phone: matched.phone,
          email: matched.email || '',
          category: matched.category,
          experience: matched.experience || '3 years',
          rating: matched.rating || 5.0,
          totalJobs: matched.totalJobs || 0,
          completedJobs: matched.completedJobs || 0,
          earnings: parsedEarnings,
          verified: matched.verified ?? true,
          availability: matched.availability || 'Available'
        };
      } else {
        proDetails = getMockProfessional();
        currentProId = proDetails.id;
      }

      // 2. Fetch bookings dynamically from local storage combined jobs
      const [pending, active, completed] = await Promise.all([
        getPendingJobs(currentProId),
        getActiveJobs(currentProId),
        getCompletedJobs(currentProId)
      ]);

      const allJobs = [...pending, ...active, ...completed];
      
      // Filter jobs by matching the professional's category if they are registered!
      const filteredJobs = matched 
        ? allJobs.filter(j => j.serviceCategory.toLowerCase() === matched.category.toLowerCase())
        : allJobs;

      const mappedBookings: BookingDisplay[] = filteredJobs.map((job) => {
        const dateObj = new Date(job.scheduledTime);
        return {
          id: job.id,
          customerName: job.customerName,
          customerPhone: job.customerPhone,
          service: job.serviceName,
          address: job.customerAddress,
          scheduledDate: dateObj.toISOString().split('T')[0],
          scheduledTime: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          status: job.status === 'accepted' ? 'confirmed' : job.status,
          amount: job.earnings
        };
      });

      // Update totalJobs, completedJobs, and earnings based on dynamic bookings!
      const totalCount = filteredJobs.length;
      const completedCount = filteredJobs.filter(j => j.status === 'completed').length;
      const calculatedEarnings = filteredJobs
        .filter(j => j.status === 'completed')
        .reduce((sum, j) => sum + (j.earnings - j.commission), 0);

      proDetails.totalJobs = totalCount > 0 ? totalCount : proDetails.totalJobs;
      proDetails.completedJobs = completedCount > 0 ? completedCount : proDetails.completedJobs;
      proDetails.earnings = calculatedEarnings > 0 ? calculatedEarnings : proDetails.earnings;

      setProfessional(proDetails);
      setBookings(mappedBookings);
    } catch (error) {
      console.error('Error fetching professional data:', error);
      setProfessional(getMockProfessional());
      setBookings(getMockBookings());
    } finally {
      setLoading(false);
    }
  }, [professionalPhone]);

  useEffect(() => {
    fetchProfessionalData();
  }, [fetchProfessionalData]);

  const handleAcceptJob = async (jobId: string) => {
    if (!professional) return;
    try {
      await acceptJob(jobId, professional.id);
      fetchProfessionalData();
      alert('Job accepted successfully! You can find it under the Active/Bookings tab or view details to start.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineJob = async (jobId: string) => {
    if (!professional) return;
    try {
      await declineJob(jobId, professional.id);
      fetchProfessionalData();
      alert('Job declined successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-[#2563EB]';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading || !professional) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => { window.location.hash = '#/profile'; }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg text-sm font-medium transition-all"
            >
              <User className="w-4 h-4" />
              <span>Switch to Customer View</span>
            </button>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{professional.name}</h1>
                <p className="text-blue-100">{professional.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  {professional.verified && (
                    <Badge className="bg-green-500 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge className="bg-white/20 text-white border-white/30">
                    {professional.experience} experience
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{professional.rating}</span>
              </div>
              <p className="text-sm text-blue-100">{professional.totalJobs} jobs</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-100" />
                <div>
                  <p className="text-sm text-blue-100">Total Jobs</p>
                  <p className="text-2xl font-bold text-white">{professional.totalJobs}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-300" />
                <div>
                  <p className="text-sm text-blue-100">Completed</p>
                  <p className="text-2xl font-bold text-white">{professional.completedJobs}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-yellow-300" />
                <div>
                  <p className="text-sm text-blue-100">Earnings</p>
                  <p className="text-2xl font-bold text-white">₹{(professional.earnings / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-blue-100">Rating</p>
                  <p className="text-2xl font-bold text-white">{professional.rating}/5</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </h2>
                <div className="space-y-4">
                  {bookings.filter(b => b.status !== 'completed').slice(0, 2).map((booking) => (
                    <div key={booking.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.service}</p>
                          <p className="text-sm text-gray-600">{booking.customerName}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.address.split(',')[0]}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {booking.status === 'pending' ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleAcceptJob(booking.id);
                            }}
                          >
                            Accept
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-[#2563EB]"
                            onClick={() => {
                              window.location.hash = `#/sp-job-detail?jobId=${booking.id}`;
                            }}
                          >
                            Start Job
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            window.location.hash = `#/sp-job-detail?jobId=${booking.id}`;
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {bookings.filter(b => b.status !== 'completed').length === 0 && (
                    <p className="text-gray-500 text-center py-4">No scheduled jobs for today</p>
                  )}
                </div>
              </Card>

              {/* Recent Earnings */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Recent Earnings
                </h2>
                <div className="space-y-3">
                  {bookings.filter(b => b.status === 'completed').map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.service}</p>
                        <p className="text-sm text-gray-600">{booking.scheduledDate}</p>
                      </div>
                      <p className="font-bold text-green-600">+₹{booking.amount}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">₹12,450</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions to SP Portal Pages */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#2563EB]" />
                Partner Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="#/sp-jobs"
                  className="group flex flex-col items-center gap-3 p-5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-all duration-300 cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-[#2563EB] text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900">My Jobs</p>
                    <p className="text-[10px] text-gray-500 font-semibold">View & manage requests</p>
                  </div>
                </a>

                <a
                  href="#/sp-schedule"
                  className="group flex flex-col items-center gap-3 p-5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl transition-all duration-300 cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900">My Schedule</p>
                    <p className="text-[10px] text-gray-500 font-semibold">Set availability hours</p>
                  </div>
                </a>

                <a
                  href="#/sp-training"
                  className="group flex flex-col items-center gap-3 p-5 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl transition-all duration-300 cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-amber-500/20">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900">Training Hub</p>
                    <p className="text-[10px] text-gray-500 font-semibold">Certifications & videos</p>
                  </div>
                </a>
              </div>
            </Card>

            {/* Availability Toggle */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Availability Status</h3>
                  <p className="text-gray-600">Toggle your availability to receive new job requests</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Currently: {professional.availability}</span>
                  <Button className="bg-green-600 hover:bg-green-700">Mark Available</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Bookings</h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-6 bg-gray-50 border-2 hover:border-blue-200 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{booking.service}</h3>
                            <p className="text-gray-600">Customer: {booking.customerName}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {booking.scheduledDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {booking.scheduledTime}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {booking.address}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {booking.customerPhone}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:min-w-[200px]">
                        <div className="text-right mb-2">
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="text-2xl font-bold text-[#2563EB]">₹{booking.amount}</p>
                        </div>
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleAcceptJob(booking.id);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept Job
                            </Button>
                            <Button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleDeclineJob(booking.id);
                              }}
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <Button
                              onClick={() => {
                                window.location.hash = `#/sp-job-detail?jobId=${booking.id}`;
                              }}
                              className="bg-[#2563EB] hover:bg-[#2563EB]"
                            >
                              Start Job
                            </Button>
                            <Button
                              onClick={() => {
                                window.location.href = `tel:${booking.customerPhone}`;
                              }}
                              variant="outline"
                            >
                              Call Customer
                            </Button>
                          </>
                        )}
                        {booking.status === 'in-progress' && (
                          <>
                            <Button
                              onClick={() => {
                                window.location.hash = `#/sp-job-detail?jobId=${booking.id}`;
                              }}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Complete Job (OTP)
                            </Button>
                            <Button
                              onClick={() => {
                                window.location.href = `tel:${booking.customerPhone}`;
                              }}
                              variant="outline"
                            >
                              Call Customer
                            </Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Button variant="outline" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    value={professional.name}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    value={professional.phone}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    value={professional.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    value={professional.category}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    value={professional.experience}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent">
                    <option>Available</option>
                    <option>Busy</option>
                    <option>On Leave</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-[#2563EB] hover:bg-[#2563EB]">Update Profile</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents & Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Identity Verification</span>
                  </div>
                  <Badge className="bg-green-600 text-white">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Background Check</span>
                  </div>
                  <Badge className="bg-green-600 text-white">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Professional Certificate</span>
                  </div>
                  <Badge className="bg-yellow-600 text-white">Pending</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
