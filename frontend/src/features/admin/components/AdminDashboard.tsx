import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  Star,
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
  Package,
  MessageSquare,
  Bell,
  Search,
  ChevronRight,
  Filter,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Home,
  AlertCircle
} from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { BookingService } from '@booking/services/bookingService';
import { supabase } from '@core/db/supabaseClient';

// Admin Subpages
import { AdminBookingsPage } from '@admin/components/AdminBookingsPage';
import { AdminProfessionalsPage } from '@admin/components/AdminProfessionalsPage';
import { AdminCustomersPage } from '@admin/components/AdminCustomersPage';
import { AdminServicesPage } from '@admin/components/AdminServicesPage';
import { AdminReportsPage } from '@admin/components/AdminReportsPage';
import { AdminPaymentsPage } from '@admin/components/AdminPaymentsPage';
import { AdminReviewsPage } from '@admin/components/AdminReviewsPage';
import { AdminNotificationsPage } from '@admin/components/AdminNotificationsPage';
import { AdminSettingsPage } from '@admin/components/AdminSettingsPage';
import { AdminSupportPage } from '@admin/components/AdminSupportPage';

interface AdminDashboardProps {
  initialSection?: string;
  onLogout: () => void;
  onNavigate: (section: string) => void;
}

export function AdminDashboard({ initialSection = 'dashboard', onLogout, onNavigate }: AdminDashboardProps) {
  const adminEmail = localStorage.getItem('visvasahome_admin_email') || 'admin@visvasahome.com';
  const adminRole = (localStorage.getItem('visvasahome_admin_role') || 'super_admin') as 'super_admin' | 'operations_manager' | 'support_agent';
  const adminName = localStorage.getItem('visvasahome_admin_name') || 'System Admin';

  const [allowedSections, setAllowedSections] = useState<string[]>([]);
  const [permsLoaded, setPermsLoaded] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data, error } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('role', adminRole)
          .single();

        if (data && !error) {
          setAllowedSections(data.allowed_sections);
        }
      } catch (err) {
        console.error('Failed to load permissions:', err);
      } finally {
        setPermsLoaded(true);
      }
    };
    fetchPermissions();
  }, [adminRole]);

  const isSectionPermitted = (sectionId: string) => {
    if (!permsLoaded) return true; // Keep true temporarily during load to avoid premature redirects
    return allowedSections.includes(sectionId);
  };

  const [activeSection, setActiveSection] = useState(initialSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [overviewRange, setOverviewRange] = useState<'daily' | 'weekly'>('daily');

  // Redirect if current section violates permissions
  useEffect(() => {
    if (permsLoaded && !isSectionPermitted(activeSection)) {
      setActiveSection('dashboard');
      onNavigate('dashboard');
    }
  }, [activeSection, adminRole, permsLoaded]);

  const [allBookings, setAllBookings] = useState(() => BookingService.getAllBookings());
  const [professionals, setProfessionals] = useState<any[]>(() => {
    const saved = localStorage.getItem('visvasahome_professionals');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'PRO10234', name: 'Amit Sharma', category: 'Plumbing', rating: 4.9, totalJobs: 127, status: 'Active', revenue: '₹1.2L' },
      { id: 'PRO10235', name: 'Meera Patel', category: 'Cleaning', rating: 4.8, totalJobs: 98, status: 'Active', revenue: '₹98K' },
      { id: 'PRO10236', name: 'Ravi Kumar', category: 'AC Service', rating: 4.9, totalJobs: 85, status: 'Active', revenue: '₹1.1L' },
      { id: 'PRO10237', name: 'Karan Singh', category: 'Painting', rating: 4.8, totalJobs: 76, status: 'Active', revenue: '₹87K' },
      { id: 'PRO10238', name: 'Suresh Yadav', category: 'Electrical', rating: 4.6, totalJobs: 52, status: 'Pending', revenue: '₹65K' },
      { id: 'PRO10239', name: 'Priya Malhotra', category: 'Painting', rating: 4.5, totalJobs: 28, status: 'Suspended', revenue: '₹45K' },
      { id: 'PRO10240', name: 'Mohit Verma', category: 'Carpentry', rating: 4.7, totalJobs: 31, status: 'Pending', revenue: '₹38K' }
    ];
  });

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (activeSection === 'dashboard') {
      setAllBookings(BookingService.getAllBookings());
      const saved = localStorage.getItem('visvasahome_professionals');
      if (saved) setProfessionals(JSON.parse(saved));
    }
  }, [activeSection]);

  const activeProsCount = professionals.filter((p: any) => p.status === 'Active').length;
  const pendingProsCount = professionals.filter((p: any) => p.status === 'Pending').length;

  const totalSpentVal = allBookings
    .filter((b: any) => b.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + (parseInt(curr.servicePrice.replace(/[^\d]/g, '')) || 0), 0);

  const stats = [
    {
      label: 'Total Bookings',
      value: (1242 + allBookings.length).toString(),
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Professionals',
      value: (337 + activeProsCount).toString(),
      change: '+8.2%',
      trend: 'up',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Customers',
      value: '5,892',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Revenue (This Month)',
      value: `₹${((1239000 + totalSpentVal) / 100000).toFixed(1)}L`,
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Pending Approvals',
      value: `${pendingProsCount} Pending`,
      change: 'Needs review',
      trend: 'warning',
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const recentBookings = allBookings.slice(0, 5).map((booking: any) => {
    let statusText = 'Scheduled';
    if (booking.status === 'completed') statusText = 'Completed';
    else if (booking.status === 'in-progress') statusText = 'In Progress';
    else if (booking.status === 'cancelled') statusText = 'Cancelled';
    else if (booking.status === 'pending') statusText = 'Pending';
    else if (booking.status === 'confirmed') statusText = 'Scheduled';

    return {
      id: booking.id,
      customer: booking.userName,
      service: booking.serviceName,
      professional: booking.professionalName || 'Not Assigned',
      amount: `₹${booking.servicePrice}`,
      status: statusText,
      date: booking.scheduledDate
    };
  });

  const topProfessionals = professionals
    .filter((p: any) => p.status === 'Active')
    .sort((a, b) => b.rating - a.rating || b.totalJobs - a.totalJobs)
    .slice(0, 4)
    .map((p: any) => ({
      name: p.name,
      category: p.category,
      rating: p.rating,
      jobs: p.totalJobs,
      revenue: p.revenue
    }));

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'professionals', label: 'Professionals', icon: Briefcase },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'payments', label: 'Payments & Payouts', icon: DollarSign },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'notifications', label: 'Broadcast Center', icon: Bell },
    { id: 'reports', label: 'Algorithms & Simulator', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <h2 className="font-bold text-base text-gray-900">VisvasaHome</h2>
                  <p className="text-xs text-gray-500">Admin Control Portal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Profile Section */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {adminName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate leading-tight">{adminName}</p>
                <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1.5 ${adminRole === 'super_admin' ? 'bg-red-100 text-red-700' :
                    adminRole === 'operations_manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-200 text-gray-700'
                  }`}>
                  {adminRole === 'super_admin' ? 'Super Admin' :
                    adminRole === 'operations_manager' ? 'Operations' :
                      'Support Agent'}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.filter(item => isSectionPermitted(item.id)).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? 'bg-blue-50 text-[#2563EB] shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50 active:scale-95'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></div>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeSection === 'dashboard' ? (
          <>
            {/* Mobile Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
              <div className="px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>

                <div className="flex-1 lg:hidden"></div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></div>
                  </button>
                  <div className="w-9 h-9 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    A
                  </div>
                </div>
              </div>

              {/* Desktop Header Title */}
              <div className="hidden lg:flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Welcome to VisvasaHome administrative hub</p>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 px-3 py-1">
                  System Active
                </Badge>
              </div>
            </header>

            {adminRole === 'support_agent' && (
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-800">
                  <strong>Read-Only Mode:</strong> You are logged in as a Support Agent. Data writing and configuration adjustments are disabled.
                </p>
              </div>
            )}

            {/* Main Stats Pane */}
            <main className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
              {/* Stats Grid - 5 Columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      onClick={() => {
                        if (stat.label === 'Pending Approvals') {
                          setActiveSection('professionals');
                          onNavigate('professionals');
                        }
                      }}
                      className="p-4 lg:p-6 hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-gray-200/60 bg-white"
                    >
                      <div className="flex items-start justify-between mb-3 lg:mb-4">
                        <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl ${stat.bgColor}`}>
                          <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                        </div>
                        <div className={`text-xs font-semibold ${stat.trend === 'warning' ? 'text-amber-600' : 'text-green-600'}`}>
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600 mb-1 line-clamp-1">{stat.label}</p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Daily / Weekly Stats Breakdown Card */}
              <Card className="p-6 border border-gray-200 bg-white shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">System Metrics Log</h3>
                    <p className="text-xs text-gray-500">Real-time daily vs weekly booking volume insights</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={overviewRange === 'daily' ? 'default' : 'outline'}
                      onClick={() => setOverviewRange('daily')}
                      className="text-xs h-8 rounded-lg"
                    >
                      Daily
                    </Button>
                    <Button
                      size="sm"
                      variant={overviewRange === 'weekly' ? 'default' : 'outline'}
                      onClick={() => setOverviewRange('weekly')}
                      className="text-xs h-8 rounded-lg"
                    >
                      Weekly
                    </Button>
                  </div>
                </div>

                {overviewRange === 'daily' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                    {[
                      { day: 'Mon', count: 45, rev: '₹14,500' },
                      { day: 'Tue', count: 52, rev: '₹18,200' },
                      { day: 'Wed', count: 48, rev: '₹15,900' },
                      { day: 'Thu', count: 61, rev: '₹22,100' },
                      { day: 'Fri', count: 70, rev: '₹26,400' },
                      { day: 'Sat', count: 85, rev: '₹34,800' },
                      { day: 'Sun', count: 92, rev: '₹38,200' }
                    ].map(d => (
                      <div key={d.day} className="bg-gray-50/50 p-3 rounded-xl border border-gray-150">
                        <p className="text-xs font-bold text-gray-500">{d.day}</p>
                        <p className="font-extrabold text-gray-900 text-base mt-1">{d.count} Jobs</p>
                        <span className="text-[10px] text-green-600 font-bold block mt-0.5">{d.rev}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      { week: 'Week 1', count: 310, rev: '₹1.12L' },
                      { week: 'Week 2', count: 340, rev: '₹1.24L' },
                      { week: 'Week 3', count: 295, rev: '₹0.98L' },
                      { week: 'Week 4', count: 302, rev: '₹1.06L' }
                    ].map(w => (
                      <div key={w.week} className="bg-gray-50/50 p-4 rounded-xl border border-gray-150">
                        <p className="text-xs font-bold text-gray-500">{w.week}</p>
                        <p className="font-extrabold text-gray-900 text-lg mt-1">{w.count} Jobs</p>
                        <span className="text-xs text-green-600 font-bold block mt-1">{w.rev}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Grid of Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="lg:col-span-2">
                  <Card className="p-4 lg:p-6 border border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900">Recent Bookings</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveSection('bookings');
                          onNavigate('bookings');
                        }}
                        className="text-xs lg:text-sm"
                      >
                        View All
                      </Button>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-3">
                      {recentBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="bg-gray-50 rounded-xl p-3 active:bg-gray-100 transition-colors border border-gray-150">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-medium text-[#2563EB] mb-0.5">{booking.id}</p>
                              <p className="font-semibold text-sm text-gray-900">{booking.customer}</p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{booking.service}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900">{booking.amount}</p>
                            <button className="text-[#2563EB] p-1 hover:bg-blue-50 rounded-lg transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-700 text-sm font-semibold">
                            <th className="text-left py-3 px-2">Booking ID</th>
                            <th className="text-left py-3 px-2">Customer</th>
                            <th className="text-left py-3 px-2">Service</th>
                            <th className="text-left py-3 px-2">Amount</th>
                            <th className="text-left py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-2 text-sm font-medium text-[#2563EB]">{booking.id}</td>
                              <td className="py-3 px-2 text-sm text-gray-900">{booking.customer}</td>
                              <td className="py-3 px-2 text-sm text-gray-600">{booking.service}</td>
                              <td className="py-3 px-2 text-sm font-semibold text-gray-900">{booking.amount}</td>
                              <td className="py-3 px-2">
                                <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Top Professionals */}
                <div>
                  <Card className="p-4 lg:p-6 border border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900">Top Professionals</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveSection('professionals');
                          onNavigate('professionals');
                        }}
                        className="text-xs lg:text-sm"
                      >
                        View All
                      </Button>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      {topProfessionals.map((pro, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-xs flex-shrink-0">
                              {pro.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">{pro.name}</p>
                              <p className="text-[10px] text-gray-500 font-semibold">{pro.category}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 justify-end">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              {pro.rating}
                            </div>
                            <p className="text-[10px] text-gray-500">{pro.jobs} jobs</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Quick Actions Shortcuts</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                  {isSectionPermitted('bookings') && (
                    <Button
                      className="bg-[#2563EB] hover:bg-[#2563EB] active:scale-95 h-auto py-5 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        setActiveSection('bookings');
                        onNavigate('bookings');
                      }}
                    >
                      <div className="text-center">
                        <Calendar className="w-6 h-6 mx-auto mb-2 text-white" />
                        <span className="block text-xs font-semibold text-white">Manage Bookings</span>
                      </div>
                    </Button>
                  )}
                  {isSectionPermitted('professionals') && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 active:scale-95 h-auto py-5 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        setActiveSection('professionals');
                        onNavigate('professionals');
                      }}
                    >
                      <div className="text-center">
                        <UserCheck className="w-6 h-6 mx-auto mb-2 text-white" />
                        <span className="block text-xs font-semibold text-white">Verify Professionals</span>
                      </div>
                    </Button>
                  )}
                  {isSectionPermitted('services') && (
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 active:scale-95 h-auto py-5 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        setActiveSection('services');
                        onNavigate('services');
                      }}
                    >
                      <div className="text-center">
                        <Package className="w-6 h-6 mx-auto mb-2 text-white" />
                        <span className="block text-xs font-semibold text-white">Manage Catalog</span>
                      </div>
                    </Button>
                  )}
                  {isSectionPermitted('reports') && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 h-auto py-5 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        setActiveSection('reports');
                        onNavigate('reports');
                      }}
                    >
                      <div className="text-center">
                        <BarChart3 className="w-6 h-6 mx-auto mb-2 text-white" />
                        <span className="block text-xs font-semibold text-white">Simulate Engine</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </main>
          </>
        ) : (
          /* Subpages loading dynamically */
          <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
            {activeSection === 'bookings' && <AdminBookingsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'professionals' && <AdminProfessionalsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'customers' && <AdminCustomersPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'services' && <AdminServicesPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'reports' && <AdminReportsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'payments' && <AdminPaymentsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'reviews' && <AdminReviewsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'notifications' && <AdminNotificationsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'settings' && <AdminSettingsPage onBack={() => onNavigate('dashboard')} />}
            {activeSection === 'messages' && <AdminSupportPage onBack={() => onNavigate('dashboard')} />}
          </div>
        )}

        {/* Mobile Bottom Navigation (Always persistent for layout switching) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg flex-shrink-0">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            <button
              onClick={() => {
                setActiveSection('dashboard');
                onNavigate('dashboard');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors active:scale-95 ${activeSection === 'dashboard'
                  ? 'text-[#2563EB] bg-blue-50'
                  : 'text-gray-600'
                }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveSection('bookings');
                onNavigate('bookings');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors active:scale-95 ${activeSection === 'bookings'
                  ? 'text-[#2563EB] bg-blue-50'
                  : 'text-gray-600'
                }`}
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Bookings</span>
            </button>
            <button
              onClick={() => {
                setActiveSection('professionals');
                onNavigate('professionals');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors active:scale-95 ${activeSection === 'professionals'
                  ? 'text-[#2563EB] bg-blue-50'
                  : 'text-gray-600'
                }`}
            >
              <Briefcase className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Pros</span>
            </button>
            <button
              onClick={() => {
                setActiveSection('customers');
                onNavigate('customers');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors active:scale-95 ${activeSection === 'customers'
                  ? 'text-[#2563EB] bg-blue-50'
                  : 'text-gray-600'
                }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Users</span>
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors active:scale-95 text-gray-600"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
