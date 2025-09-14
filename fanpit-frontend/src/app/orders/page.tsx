'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  eventTitle: string;
  eventImage: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: number;
  quantity: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    eventTitle: 'HackFest 2024',
    eventImage: '/images/events/hackathon.jpg',
    date: '2024-03-15',
    status: 'confirmed',
    price: 0,
    quantity: 1
  },
  {
    id: '2',
    eventTitle: 'Brew Your Own Coffee',
    eventImage: '/images/experiences/coffee.jpg',
    date: '2024-03-25',
    status: 'pending',
    price: 79.99,
    quantity: 2
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    // In a real app, fetch orders from API
    setOrders(mockOrders);
  }, [user, router]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                  <Image
                    src={order.eventImage}
                    alt={order.eventTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{order.eventTitle}</h3>
                  <p className="text-gray-600">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                </div>

                <div className="text-right">
                  <div
                    className={`mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <p className="text-xl font-bold text-[#7C3AED]">
                    ${(order.price * order.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
