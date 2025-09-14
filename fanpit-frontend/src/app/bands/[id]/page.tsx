import Image from 'next/image';
import Link from 'next/link';
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { spaceService } from '@/services/space.service';
import type { Band } from '@/types';
import type { Space } from '@/types/api.types';

// This will be replaced with actual API call
async function getBandData(id: string): Promise<Band | null> {
  try {
    // For now, return null as we don't have a bands API yet
    // This will be implemented when we add the bands feature
    return null;
  } catch (error) {
    console.error('Error fetching band data:', error);
    return null;
  }
}

async function getBandEvents(bandId: string): Promise<Space[]> {
  try {
    // Get spaces that are events and might be associated with this band
    const response = await spaceService.getSpaces(1, 10);
    return response.data.items.filter((space: Space) => space.type === 'event');
  } catch (error) {
    console.error('Error fetching band events:', error);
    return [];
  }
}

export default async function BandProfilePage({ params }: { params: { id: string } }) {
  const band = await getBandData(params.id);
  const bandEvents = await getBandEvents(params.id);

  if (!band) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Band Not Found</h1>
          <p className="text-gray-600">The band you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Band Header */}
      <div className="bg-purple-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold md:text-5xl">{band.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12 rounded-lg bg-white p-8 shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">About the Band</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="whitespace-pre-line">{band.description}</div>
              </div>
            </div>

            {/* Gallery */}
            {band.gallery && band.gallery.length > 0 && (
              <div className="mb-12 rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Gallery</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {band.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-lg"
                    >
                      <Image
                        src={image}
                        alt={`${band.name} gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {bandEvents.length > 0 && (
              <div className="rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {bandEvents.map((space) => (
                    <div key={space.id} className="rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900">{space.name}</h3>
                      <p className="mt-2 text-gray-600">{space.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{space.address}</span>
                        <span className="text-lg font-semibold text-purple-600">₹{space.basePrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-8 shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <EnvelopeIcon className="mr-4 h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a
                      href={`mailto:${band.contactInfo.email}`}
                      className="text-lg text-purple-600 hover:text-purple-700"
                    >
                      {band.contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <PhoneIcon className="mr-4 h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a
                      href={`tel:${band.contactInfo.phone}`}
                      className="text-lg text-purple-600 hover:text-purple-700"
                    >
                      {band.contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <GlobeAltIcon className="mr-4 h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a
                      href={`https://${band.contactInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-purple-600 hover:text-purple-700"
                    >
                      {band.contactInfo.website}
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">Social Media</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(band.contactInfo.socialMedia).map(
                      ([platform, url]) => (
                        <a
                          key={platform}
                          href={`https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-lg bg-purple-50 px-4 py-2 text-purple-700 transition-colors hover:bg-purple-100"
                        >
                          <span className="capitalize">{platform}</span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}