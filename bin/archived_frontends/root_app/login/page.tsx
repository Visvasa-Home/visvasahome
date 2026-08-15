'use client';

import { AuthPage } from '../../src/app/components/AuthPage';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (phoneNumber: string) => {
    localStorage.setItem('visvasahome_user_phone', phoneNumber);
    
    // Automatic role redirection matching edge router
    const adminRole = localStorage.getItem('visvasahome_admin_role');
    if (adminRole) {
      router.push('/admin/dashboard');
      return;
    }

    const partnerId = localStorage.getItem('visvasahome_partner_id');
    if (partnerId) {
      router.push('/partner/dashboard');
      return;
    }

    router.push('/customer/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AuthPage 
        onLoginSuccess={handleLoginSuccess} 
        onBack={() => router.push('/')} 
      />
    </div>
  );
}
