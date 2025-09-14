'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SpaceForm from '@/components/SpaceForm';

export default function NewSpacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'brand_owner') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'brand_owner') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Space</h1>
        <p className="mt-2 text-gray-600">Fill in the details below to create your new space.</p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <SpaceForm />
      </div>
    </div>
  );
}