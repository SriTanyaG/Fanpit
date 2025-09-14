'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/booking.service';
import type { Booking } from '@/types/api.types';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.items || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(id);
      await loadBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">No Bookings Found</h2>
            <p className="mb-6 text-gray-600">
              You haven't made any bookings yet.
            </p>
            <Link
              href="/"
              className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
            >
              Explore Spaces
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <div className="grid md:grid-cols-4">
                  {/* Space Image */}
                  <div className="relative h-48 md:h-full">
                    <Image
                      src={booking.space.images[0] || '/placeholder.jpg'}
                      alt={booking.space.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="p-6 md:col-span-3">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        {booking.space.name}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Seats</p>
                        <p className="font-medium">{booking.seats}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">{booking.space.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/spaces/${booking.space.id}`}
                        className="text-[#7C3AED] hover:text-[#6D28D9]"
                      >
                        View Space Details
                      </Link>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="rounded-lg bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}