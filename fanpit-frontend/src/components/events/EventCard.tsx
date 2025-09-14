import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatDate, formatPrice } from '@/lib/utils';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/${event.type}s/${event.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-[1.02]"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.posterUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-600">
              {event.category}
            </p>
            <p className="text-sm font-semibold text-black">
              {formatPrice(event.price)}
            </p>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-semibold text-black">{event.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-black">
              {event.description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4 text-sm text-black">
          <div className="flex items-center">
            <CalendarIcon className="mr-1.5 h-4 w-4" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-1.5 h-4 w-4" />
            {event.location}
          </div>
        </div>
      </div>
    </Link>
  );
}