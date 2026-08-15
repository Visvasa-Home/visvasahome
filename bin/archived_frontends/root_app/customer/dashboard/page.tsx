'use client';

import { UserProfilePage } from '../../../src/app/components/UserProfilePage';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setPhone(localStorage.getItem('visvasahome_user_phone') || '+91-9876543210');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('visvasahome_user_phone');
    localStorage.removeItem('session_info');
    router.push('/login');
  };

  const handleNavigate = (page: string) => {
    // Map navigation links in Next.js subfolders
    if (page === 'wallet') {
      router.push('/customer/wallet');
    } else if (page === 'addresses') {
      router.push('/customer/addresses');
    } else {
      router.push(`/customer/dashboard`);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 border-x border-slate-200 shadow-sm">
      <UserProfilePage 
        phoneNumber={phone}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
