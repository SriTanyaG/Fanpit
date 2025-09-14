'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CategoryFilters from '@/components/filters/CategoryFilters';
import { mockEvents } from '@/data/mockData';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const category = searchParams.get('category');

  // Reset filtered events when category changes
  useEffect(() => {
    setFilteredEvents(mockEvents);
  }, [category]);

  const handleSearch = (query: string) => {
    let filtered = [...mockEvents];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter((event) => {
        const searchString = `${event.title} ${event.description} ${event.category} ${event.location}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
      });
    }

    // Apply category filter
    if (category) {
      filtered = filtered.filter((event) => event.category === category);
    }

    setFilteredEvents(filtered);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Discover Amazing <span className="text-[#7C3AED]">Events</span>
          </h1>
          <p className="text-lg text-gray-600">
            {filteredEvents.length} amazing events waiting for you
          </p>
        </section>

        {/* Filters */}
        <CategoryFilters 
          type="events"
          onSearch={handleSearch}
          searchPlaceholder="Search events by name..."
        />

        {/* Events Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No events found matching your criteria</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={event.posterUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm">
                    {event.category}
                  </div>
                  <button 
                    className="absolute right-4 top-4 rounded-full bg-white/90 p-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: event.description,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-[#7C3AED]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                  <p className="mb-4 text-gray-600">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#7C3AED]">
                      {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}