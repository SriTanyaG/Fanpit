import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import { mockEvents } from '@/data/mockData';

export default function EventPage({ params }: { params: { id: string } }) {
  const event = mockEvents.find(e => e.id === params.id && e.type === 'event');

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Column - Fixed Poster */}
        <div className="w-1/3 bg-gray-100 p-8">
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Scrollable Content */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold text-gray-900">{event.title}</h1>
            
            <div className="mb-8 flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-purple-600" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-purple-600" />
                {event.location}
              </div>
            </div>

            {/* Ticket Price Box */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Ticket Price</h2>
                <span className="text-2xl font-bold text-purple-600">
                  ${event.price.toFixed(2)}
                </span>
              </div>
              <button className="w-full rounded-lg bg-purple-600 py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-purple-700">
                Book Tickets
              </button>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About This Event</h2>
              <p className="text-gray-700">{event.description}</p>
            </div>

            {/* What to Expect */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">What to expect:</h2>
              <ul className="list-inside list-disc space-y-3 text-gray-700">
                <li>Multiple stages featuring different genres</li>
                <li>Food and beverage vendors</li>
                <li>Merchandise stands</li>
                <li>VIP areas with exclusive access</li>
                <li>Meet and greet opportunities with the bands</li>
              </ul>
            </div>

            <p className="mb-8 text-lg font-medium text-gray-900">
              Don&apos;t miss out on this incredible music experience!
            </p>

            {/* View Band Profile Button - Always visible */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Want to know more about the performers?
                  </h3>
                  <p className="mt-1 text-gray-700">
                    View their profile for more events and details
                  </p>
                </div>
                <Link
                  href={`/bands/${event.bandId || '1'}`}
                  className="rounded-lg bg-purple-600 px-8 py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-purple-700"
                >
                  View Band Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}