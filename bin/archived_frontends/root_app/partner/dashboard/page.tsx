'use client';

import { ProfessionalDashboard } from '../../../src/app/components/ProfessionalDashboard';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [partnerPhone, setPartnerPhone] = useState('');

  useEffect(() => {
    setPartnerPhone(localStorage.getItem('visvasahome_partner_phone') || '+91-9123456789');
  }, []);

  return (
    <ProfessionalDashboard 
      professionalPhone={partnerPhone}
      onBack={() => router.push('/')}
    />
  );
}
