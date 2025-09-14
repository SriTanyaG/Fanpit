'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/booking.service';
import type { Booking } from '@/types/api.types';
import { format } from 'date-fns';

export default function DashboardBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'brand_owner') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadBookings();
  }, [page, status]);

  const loadBookings = async () => {
    try {
      setPageLoading(true);
      const response = await bookingService.getBookings({
        page,
        status: status === 'all' ? undefined : status
      });
      setBookings(response.items || []);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setPageLoading(false);
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-2 text-gray-600">Manage your space bookings</p>
      </div>

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

      {pageLoading ? (
        <div className="text-center">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-600">No bookings found</div>
      ) : (
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
              <div className="mt-4">
                <p className="text-sm text-gray-600">Seats: {booking.seats}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Amount: ₹{booking.amount}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Payment Status: {booking.isPaid ? 'Paid' : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
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
      )}
    </div>
  );
}
