'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { spaceService } from '@/services/space.service';
import type { Space } from '@/types/api.types';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'event' | 'experience' | 'all'>('all');

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await spaceService.getSpaces();
        setSpaces(response.items || []);
      } catch (err: any) {
        console.error('Error loading spaces:', err);
        setError(err.message || 'Failed to load spaces');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleSearch = (search: string, type: 'event' | 'experience' | 'all') => {
    setSearchTerm(search);
    setSelectedType(type);
  };
  
  // Calculate filtered spaces based on search term and selected type
  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = !searchTerm || 
      space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || space.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading spaces...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Unlock Amazing <span className="text-[#7C3AED]">Experiences</span>
          </h1>
          <p className="text-lg text-gray-600">
            {filteredSpaces.length} amazing {selectedType === 'all' ? 'spaces' : selectedType + 's'} waiting for you
          </p>
        </section>

        {/* Search Section */}
        <SearchBar onSearch={handleSearch} />

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleSearch(searchTerm, 'all')}
              className={`rounded-full px-6 py-2 transition-colors ${
                selectedType === 'all' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleSearch(searchTerm, 'event')}
              className={`rounded-full px-6 py-2 transition-colors ${
                selectedType === 'event' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => handleSearch(searchTerm, 'experience')}
              className={`rounded-full px-6 py-2 transition-colors ${
                selectedType === 'experience' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              Experiences
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Spaces Grid */}
        {filteredSpaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a space!'}
            </p>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
              >
                <div className="relative h-64 w-full">
                  {space.images && space.images.length > 0 ? (
                    <Image
                      src={space.images[0]}
                      alt={space.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm">
                    {space.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">{space.name}</h3>
                  <p className="mb-4 text-gray-600 line-clamp-2">{space.description}</p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {space.address}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#7C3AED]">
                        ₹{space.basePrice}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        per {space.type === 'event' ? 'ticket' : 'seat'}
                      </span>
                    </div>
                    <Link
                      href={`/spaces/${space.id}`}
                      className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}