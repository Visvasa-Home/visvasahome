'use client';

import { AdminDashboard } from '../../../src/app/components/AdminDashboard';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('visvasahome_admin_token');
    localStorage.removeItem('visvasahome_admin_email');
    localStorage.removeItem('visvasahome_admin_role');
    localStorage.removeItem('visvasahome_admin_name');
    localStorage.removeItem('visvasahome_admin_id');
    router.push('/login');
  };

  const handleNavigate = (section: string) => {
    // Map navigation links in Next.js subfolders
    router.push(`/admin/${section}`);
  };

  return (
    <AdminDashboard 
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
}
