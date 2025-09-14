'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { bookingService } from '@/services/booking.service';
import type { Booking } from '@/types/api.types';

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    loadBookings();
  }, [page, status]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings({
        page,
        status: status === 'all' ? undefined : status
      });
      setBookings(response.items || []);
      setTotalPages(response.totalPages);
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

  const renderFilters = () => (
    <div className="mb-6">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as 'all' | 'confirmed' | 'cancelled')}
        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#7C3AED] focus:outline-none"
      >
        <option value="all">All Bookings</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
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

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-gray-600">No bookings found</p>
        <Link
          href="/spaces"
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
        >
          Browse Spaces
        </Link>
      </div>
    );
  }

  return (
    <div>
      {renderFilters()}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="overflow-hidden rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{booking.space.name}</h3>
                <p className="mt-1 text-gray-600">{booking.space.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {format(new Date(booking.date), 'MMM d, yyyy')}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Seats: {booking.seats}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Amount: ₹{booking.amount}
                </p>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  );
}