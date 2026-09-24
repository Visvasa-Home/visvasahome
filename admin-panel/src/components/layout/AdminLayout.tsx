import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, UserCog, CalendarCheck, CreditCard,
  BarChart3, Star, Bell, Settings, LogOut, Menu, X,
  AlertTriangle, Shield, ChevronRight, Zap, MessageSquare
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/dashboard/professionals', icon: UserCog, label: 'Professionals' },
  { to: '/dashboard/customers', icon: Users, label: 'Customers' },
  { to: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
  { to: '/dashboard/reports', icon: BarChart3, label: 'Reports & Analytics' },
  { to: '/dashboard/reviews', icon: Star, label: 'Reviews' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/dashboard/support', icon: MessageSquare, label: 'Support' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  const [adminRole, setAdminRole] = useState('');
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [showSosBanner, setShowSosBanner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('visvasa_admin_token');
    if (!token) { navigate('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAdminName(payload.name || 'Admin');
      setAdminRole(payload.role || '');
    } catch { navigate('/login'); }

    // Socket.io for live SOS alerts
    const socket = (window as any).__adminSocket;
    if (!socket) {
      const io = (window as any).io;
      if (io) {
        const socketUrl = import.meta.env.VITE_API_URL || 'https://visvasahomebackend.onrender.com';
        const s = io(socketUrl);
        (window as any).__adminSocket = s;
        s.on('SOS_ALERT_TRIGGERED', (data: any) => {
          setSosAlerts(prev => [data, ...prev]);
          setShowSosBanner(true);
          setTimeout(() => setShowSosBanner(false), 8000);
        });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('visvasa_admin_token');
    navigate('/login');
  };

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    operations_manager: 'Operations Manager',
    support_agent: 'Support Agent',
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* SOS Banner */}
      {showSosBanner && sosAlerts[0] && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-bold text-sm">🚨 SOS Alert!</p>
            <p className="text-xs">Partner triggered emergency — Job: {sosAlerts[0]?.jobId}</p>
          </div>
          <button onClick={() => setShowSosBanner(false)} className="ml-2"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-sm text-white">VisvasaHome</p>
              <p className="text-xs text-slate-400">Admin Console</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
              {sidebarOpen && label === 'Notifications' && sosAlerts.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {sosAlerts.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-slate-800 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {adminName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{adminName}</p>
                <p className="text-xs text-slate-400 truncate">{roleLabel[adminRole] || adminRole}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-slate-400 hover:text-red-400 transition-colors py-1">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>VisvasaHome Admin</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>
            {sosAlerts.length > 0 && (
              <NavLink to="/dashboard/notifications" className="relative">
                <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {sosAlerts.length}
                </span>
              </NavLink>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
