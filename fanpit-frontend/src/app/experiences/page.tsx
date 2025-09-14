'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CategoryFilters from '@/components/filters/CategoryFilters';
import { mockExperiences } from '@/data/mockData';

export default function ExperiencesPage() {
  const searchParams = useSearchParams();
  const [filteredExperiences, setFilteredExperiences] = useState(mockExperiences);
  const category = searchParams.get('category');

  const handleSearch = (query: string) => {
    const filtered = mockExperiences.filter((experience) => {
      const searchString = `${experience.title} ${experience.description} ${experience.category}`.toLowerCase();
      return searchString.includes(query.toLowerCase());
    });
    setFilteredExperiences(filtered);
  };

  // Filter experiences by category if one is selected
  const displayedExperiences = category
    ? filteredExperiences.filter((experience) => experience.category === category)
    : filteredExperiences;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Discover Unique <span className="text-[#7C3AED]">Experiences</span>
          </h1>
          <p className="text-lg text-gray-600">
            {displayedExperiences.length} amazing experiences waiting for you
          </p>
        </section>

        {/* Filters */}
        <CategoryFilters onSearch={handleSearch} type="experiences" />

        {/* Experiences Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedExperiences.map((experience) => (
            <div
              key={experience.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={experience.posterUrl}
                  alt={experience.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm">
                  {experience.category}
                </div>
                <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 opacity-0 transition-opacity group-hover:opacity-100">
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">{experience.time}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{experience.title}</h3>
                <p className="mb-4 text-gray-600">{experience.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#7C3AED]">
                    ${experience.price.toFixed(2)}
                  </span>
                  <Link
                    href={`/experiences/${experience.id}`}
                    className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}