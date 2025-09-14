'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { spaceService } from '@/services/space.service';
import type { Space } from '@/types/api.types';

export default function SpaceList() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<'all' | 'event' | 'experience'>('all');
  const [capacity, setCapacity] = useState<number | ''>('');

  useEffect(() => {
    loadSpaces();
  }, [page, searchTerm, type, capacity]);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      const filters = {
        page,
        search: searchTerm,
        type: type !== 'all' ? type : undefined,
        capacity: capacity || undefined
      };
      const response = await spaceService.getMySpaces(filters);
      setSpaces(response.items || []);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this space?')) return;
    
    try {
      await spaceService.deleteSpace(id);
      await loadSpaces();
    } catch (err: any) {
      setError(err.message || 'Failed to delete space');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const renderFilters = () => (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#7C3AED] focus:outline-none"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'all' | 'event' | 'experience')}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#7C3AED] focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="event">Event</option>
          <option value="experience">Experience</option>
        </select>
        <input
          type="number"
          placeholder="Min Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')}
          className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#7C3AED] focus:outline-none"
        />
      </div>
    </div>
  );

  const renderPagination = () => (
    <div className="mt-6 flex justify-center gap-2">
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="flex items-center px-4">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  if (spaces.length === 0 && !searchTerm && type === 'all' && !capacity) {
    return (
      <div className="text-center">
        <p className="mb-4 text-gray-600">No spaces found</p>
        <Link
          href="/dashboard/spaces/new"
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
        >
          Create Your First Space
        </Link>
      </div>
    );
  }

  return (
    <div>
      {renderFilters()}
      {spaces.length === 0 ? (
        <div className="text-center text-gray-600">No spaces found matching your criteria</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
        <div
          key={space.id}
          className="overflow-hidden rounded-lg bg-white shadow-lg"
        >
          <div className="relative h-48">
            <Image
              src={space.images[0] || '/placeholder.jpg'}
              alt={space.name}
              fill
              className="object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm">
              {space.type}
            </div>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-xl font-semibold">{space.name}</h3>
            <p className="mb-4 text-sm text-gray-600">{space.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-semibold">{space.capacity} people</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/spaces/${space.id}/edit`}
                  className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(space.id)}
                  className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
        </div>
      )}
      {renderPagination()}
    </div>
  );
}
