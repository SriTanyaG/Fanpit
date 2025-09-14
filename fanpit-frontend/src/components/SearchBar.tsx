'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  onSearch?: (search: string, type: 'event' | 'experience' | 'all') => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState<'event' | 'experience' | 'all'>(
    (searchParams.get('type') as 'event' | 'experience' | 'all') || 'all'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, type);
    } else {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (type !== 'all') params.set('type', type);
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spaces by name, location, or amenities..."
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'event' | 'experience' | 'all')}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="all">All Types</option>
            <option value="event">Event</option>
            <option value="experience">Experience</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#7C3AED] px-6 py-2 text-white hover:bg-[#6D28D9]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
