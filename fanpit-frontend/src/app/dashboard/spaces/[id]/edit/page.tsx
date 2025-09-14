'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { spaceService } from '@/services/space.service';
import type { Space } from '@/types/api.types';
import SpaceForm from '@/components/SpaceForm';

export default function EditSpacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpace();
  }, [params.id]);

  const loadSpace = async () => {
    try {
      setLoading(true);
      setError(null);
      const spaceData = await spaceService.getSpaceById(params.id);
      setSpace(spaceData);
    } catch (err: any) {
      setError(err.message || 'Failed to load space');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (updatedSpace: Space) => {
    try {
      await spaceService.updateSpace(params.id, updatedSpace);
      router.push('/dashboard/spaces');
    } catch (err: any) {
      setError(err.message || 'Failed to update space');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading space...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!space) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Space not found</p>
        <button
          onClick={() => router.push('/dashboard/spaces')}
          className="mt-4 rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
        >
          Back to Spaces
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Space</h1>
        <button
          onClick={() => router.push('/dashboard/spaces')}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
      
      <SpaceForm space={space} onSubmit={handleSubmit} />
    </div>
  );
}