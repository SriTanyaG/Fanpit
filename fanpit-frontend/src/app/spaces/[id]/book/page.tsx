'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { spaceService } from '@/services/space.service';
import { Space } from '@/types/api.types';
import { format } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 21; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: Math.random() > 0.3 // Simulated availability
    });
  }
  return slots;
};

export default function BookingPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [seats, setSeats] = useState(1);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const data = await spaceService.getSpaceById(params.id);
        setSpace(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load space');
      }
    };

    if (params.id) {
      loadSpace();
    }
  }, [params.id]);

  useEffect(() => {
    // In a real app, this would fetch actual availability from the backend
    setTimeSlots(generateTimeSlots());
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;

    try {
      const bookingData = {
        spaceId: space.id,
        date: space.type === 'event' ? selectedDate : `${selectedDate}T${selectedTime}`,
        seats,
        amount: space.basePrice * seats
      };

      // TODO: Implement booking creation with payment
      router.push('/dashboard/bookings');
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    }
  };

  if (loading || !space) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Book {space.name}</h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>

            {space.type === 'experience' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        selectedTime === slot.time
                          ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                          : slot.available
                          ? 'border-gray-300 hover:border-[#7C3AED]'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of {space.type === 'event' ? 'Tickets' : 'Seats'}
              </label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={space.capacity}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-semibold">Booking Summary</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Price per {space.type === 'event' ? 'ticket' : 'seat'}</span>
                  <span>₹{space.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{seats}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{space.basePrice * seats}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
                disabled={space.type === 'experience' && !selectedTime}
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
