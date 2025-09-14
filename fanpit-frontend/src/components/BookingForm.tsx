'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/booking.service';
import { spaceService } from '@/services/space.service';
import { format, addDays, isSameDay } from 'date-fns';
import type { Space, TimeBlock } from '@/types/api.types';

interface BookingFormProps {
  space: Space;
  onSuccess?: () => void;
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  price: number;
}

interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}

export default function BookingForm({ space, onSuccess }: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [seats, setSeats] = useState(1);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    basePrice: number;
    discount: number;
    finalPrice: number;
    items: { description: string; amount: number }[];
  } | null>(null);

  useEffect(() => {
    loadAvailability();
  }, []);

  useEffect(() => {
    if (selectedSlot) {
      calculatePrice();
    }
  }, [selectedSlot, seats]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      
      // Generate mock availability data for the next 7 days
      const mockAvailability: DayAvailability[] = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(today, i);
        const slots: TimeSlot[] = [];
        
        // Generate time slots from 9 AM to 9 PM with 2-hour intervals
        for (let hour = 9; hour < 21; hour += 2) {
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(date);
          endTime.setHours(hour + 2, 0, 0, 0);
          
          // Randomly determine if slot is available
          const isAvailable = Math.random() > 0.3;
          
          slots.push({
            startTime,
            endTime,
            isAvailable,
            price: space.basePrice || 1000
          });
        }
        
        mockAvailability.push({
          date,
          slots
        });
      }
      
      setAvailability(mockAvailability);
      setSelectedDate(today);
    } catch (error: any) {
      console.error('Error loading availability:', error);
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    if (!selectedSlot) return;

    // Simple price calculation for now
    const basePrice = space.basePrice || 1000;
    const totalPrice = basePrice * seats;
    
    setPriceBreakdown({
      basePrice,
      discount: 0,
      finalPrice: totalPrice,
      items: [
        { description: `Base price (${seats} seats)`, amount: totalPrice }
      ]
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !priceBreakdown) return;

    try {
      setLoading(true);
      setError(null);

      // Validate user is logged in
      if (!user) {
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // Create booking request object
      const bookingData = {
        spaceId: space.id,
        date: selectedSlot.startTime.toISOString(),
        seats,
        amount: priceBreakdown.finalPrice
      };

      console.log('Submitting booking:', bookingData);
      
      // Create booking directly (simplified version without payment)
      await bookingService.createBooking(bookingData);

      setSuccess('Booking created successfully!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/bookings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !availability.length) {
    return <div>Loading availability...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-500">{success}</div>
      )}

      {/* Calendar */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Select Date</h3>
        <div className="grid gap-4 md:grid-cols-7">
          {availability.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              onClick={() => handleDateSelect(day.date)}
              className={`rounded-lg border p-2 text-center ${
                isSameDay(selectedDate, day.date)
                  ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                  : 'border-gray-200 hover:border-[#7C3AED]'
              }`}
            >
              <div className="text-sm font-medium">
                {format(day.date, 'EEE')}
              </div>
              <div className="mt-1 text-lg">
                {format(day.date, 'd')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Select Time</h3>
          <div className="grid gap-2 md:grid-cols-4">
            {availability
              .find(day => isSameDay(day.date, selectedDate))
              ?.slots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={!slot.isAvailable}
                  onClick={() => handleSlotSelect(slot)}
                  className={`rounded-lg border p-2 text-center ${
                    selectedSlot === slot
                      ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                      : slot.isAvailable
                      ? 'border-gray-200 hover:border-[#7C3AED]'
                      : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className="text-sm">
                    {format(slot.startTime, 'h:mm a')}
                  </div>
                  {slot.isAvailable && (
                    <div className="mt-1 text-xs">
                      ₹{slot.price}
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Seats */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Seats
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


      {/* Price Breakdown */}
      {priceBreakdown && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-semibold">Price Breakdown</h3>
          <div className="space-y-2">
            {priceBreakdown.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.description}</span>
                <span>₹{item.amount}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{priceBreakdown.finalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
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
          disabled={loading || !selectedSlot}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
}