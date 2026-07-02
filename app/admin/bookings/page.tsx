'use client';

import { AdminBookingsPage } from '../../../src/app/components/AdminBookingsPage';
import { useRouter } from 'next/navigation';

export default function BookingsPage() {
  const router = useRouter();

  return (
    <AdminBookingsPage 
      onBack={() => router.push('/admin/dashboard')}
    />
  );
}
