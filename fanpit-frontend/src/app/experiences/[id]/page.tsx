import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import { spaceService } from '@/services/space.service';
import type { Space } from '@/types/api.types';

async function getExperience(id: string): Promise<Space | null> {
  try {
    const space = await spaceService.getSpaceById(id);
    return space;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
}

export default async function ExperiencePage({ params }: { params: { id: string } }) {
  const experience = await getExperience(params.id);

  if (!experience || experience.type !== 'experience') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experience Not Found</h1>
          <p className="text-gray-600">The experience you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Column - Fixed Poster */}
        <div className="w-1/3 bg-gray-100 p-8">
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={experience.images[0] || '/placeholder.jpg'}
                alt={experience.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Scrollable Content */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl">
            <div className="mb-4">
              <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
                {experience.type}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-gray-900">
              {experience.name}
            </h1>
            
            <div className="mb-8 flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-purple-600" />
                {experience.address}
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-purple-600" />
                Capacity: {experience.capacity}
              </div>
            </div>

            {/* Price Box */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Experience Price
                </h2>
                <span className="text-2xl font-bold text-purple-600">
                  ₹{experience.basePrice}
                </span>
              </div>
              <button className="w-full rounded-lg bg-purple-600 py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-purple-700">
                Book Now
              </button>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                About this experience
              </h2>
              <p className="whitespace-pre-wrap text-gray-700">
                {experience.description}
              </p>
            </div>

            {/* What to Expect */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                What to expect
              </h2>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {experience.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Additional Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Capacity:</strong> {experience.capacity} people
                </p>
                <p>
                  <strong>Type:</strong> {experience.type}
                </p>
                <p>
                  <strong>Base Price:</strong> ₹{experience.basePrice}
                </p>
                {experience.dayRate > 0 && (
                  <p>
                    <strong>Day Rate:</strong> ₹{experience.dayRate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}