'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { spaceService } from '@/services/space.service';
import { bookingService } from '@/services/booking.service';
import { paymentService } from '@/services/payment.service';
import { loadRazorpay } from '@/utils/razorpay';
// Change this line

import { useAuth } from '@/contexts/AuthContext';
import type { Space } from '@/types/api.types';

export default function SpaceDetailsPage({ params }: { params: { id: string } }) {
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [seats, setSeats] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const data = await spaceService.getSpaceById(params.id);
        setSpace(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load space details');
        setLoading(false);
      }
    };

    fetchSpace();
  }, [params.id]);

  const handleBooking = async () => {
    setBookingError(null);
    setBookingSuccess(null);
    setProcessingPayment(true);
    
    if (!user) {
      setBookingError('Please login to book this space');
      setProcessingPayment(false);
      return;
    }

    if (!bookingDate) {
      setBookingError('Please select a date');
      setProcessingPayment(false);
      return;
    }

    try {
      // Calculate amount based on space price and seats
      const amount = space?.basePrice ? space.basePrice * seats : 1000 * seats; // Default to 1000 if price not available
      
      // Create booking
      const bookingData = {
        spaceId: params.id,
        date: bookingDate,
        seats,
        amount
      };
      
      const booking = await bookingService.createBooking(bookingData);
      
      // Load Razorpay script
      try {
        await loadRazorpay();
      } catch (error) {
        setBookingError('Failed to load payment gateway');
        setProcessingPayment(false);
        return;
      }
      
      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // in paise
        currency: 'INR',
        name: 'Fanpit',
        description: `Booking for ${space?.name}`,
        order_id: booking.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            };
            
            // Inside the handler function
            const verificationResponse = await paymentService.verifyPayment(
              verificationData.paymentId,
              verificationData.orderId,
              verificationData.signature
            );
            
            if (verificationResponse.success) {
              setBookingSuccess('Booking confirmed successfully!');
              // Redirect to bookings page after successful payment
              setTimeout(() => {
                router.push('/bookings');
              }, 2000);
            } else {
              setBookingError('Payment verification failed');
            }
          } catch (err) {
            setBookingError('Failed to verify payment');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      await paymentService.initializePayment(options);
    } catch (err) {
      setBookingError('Failed to create booking');
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!space) return <div className="p-8 text-center">Space not found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Image Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <img 
              src={space.images[0] || '/images/placeholder.jpg'} 
              alt={space.name} 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {space.images.slice(1, 5).map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${space.name} ${index + 1}`} 
                className="w-full h-44 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Space Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
          <p className="text-gray-600 mb-4">{space.address}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{space.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {space.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-medium">{space.type}</p>
              </div>
              <div>
                <p className="text-gray-600">Capacity</p>
                <p className="font-medium">{space.capacity} people</p>
              </div>
              <div>
                <p className="text-gray-600">Rating</p>
                <p className="font-medium">{space.rating} ⭐ ({space.reviewCount} reviews)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Book this Space</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded-md"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Number of Seats</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded-md"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              min={1}
              max={space.capacity}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Price per seat</span>
              <span>₹{space.basePrice || 1000}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{(space.basePrice || 1000) * seats}</span>
            </div>
          </div>
          
          <button 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleBooking}
            disabled={processingPayment}
          >
            {processingPayment ? 'Processing...' : 'Book Now'}
          </button>
          
          {bookingError && (
            <div className="mt-4 text-red-500 text-sm">{bookingError}</div>
          )}
          
          {bookingSuccess && (
            <div className="mt-4 text-green-500 text-sm">{bookingSuccess}</div>
          )}
        </div>
      </div>
    </div>
  );
}
