'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { spaceService } from '@/services/space.service';
import { bookingService } from '@/services/booking.service';
import type { Space, Booking } from '@/types/api.types';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'brand_owner') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [spacesResponse, bookingsResponse] = await Promise.all([
          spaceService.getMySpaces(),
          bookingService.getBookings()
        ]);
        setSpaces(spacesResponse.items || []);
        setBookings(bookingsResponse.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'brand_owner') {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="mt-2 text-gray-600">Here's an overview of your spaces and bookings.</p>
      </div>

      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Spaces Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-[#7C3AED]">{spaces.length}</p>
              <p className="text-gray-600">Total Spaces</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#7C3AED]">
                {spaces.filter((space) => space.isActive).length}
              </p>
              <p className="text-gray-600">Active Spaces</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Bookings Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-[#7C3AED]">{bookings.length}</p>
              <p className="text-gray-600">Total Bookings</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#7C3AED]">
                {bookings.filter((booking) => booking.status === 'confirmed').length}
              </p>
              <p className="text-gray-600">Confirmed Bookings</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Revenue</h2>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-green-600">
                ₹{bookings
                  .filter((booking) => booking.status === 'confirmed')
                  .reduce((total, booking) => total + (booking.amount || 0), 0)
                  .toLocaleString()}
              </p>
              <p className="text-gray-600">Total Revenue</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">
                ₹{bookings
                  .filter((booking) => booking.status === 'confirmed')
                  .reduce((total, booking) => total + (booking.amount || 0), 0) / Math.max(bookings.length, 1)
                  .toFixed(0)}
              </p>
              <p className="text-gray-600">Avg per Booking</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Performance</h2>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-blue-600">
                {spaces.length > 0 ? Math.round((bookings.length / spaces.length) * 100) : 0}%
              </p>
              <p className="text-gray-600">Booking Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">
                {bookings.filter((booking) => booking.status === 'pending').length}
              </p>
              <p className="text-gray-600">Pending Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left">Space</th>
                  <th className="pb-2 text-left">Date</th>
                  <th className="pb-2 text-left">Amount</th>
                  <th className="pb-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="py-2">{booking.space?.name || 'Unknown Space'}</td>
                    <td className="py-2">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="py-2">₹{booking.amount}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}