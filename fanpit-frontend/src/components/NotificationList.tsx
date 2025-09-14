'use client';

import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notification.service';
import type { Notification } from '@/types/api.types';
import { format } from 'date-fns';

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotifications();
  }, [page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications({ page });
      setNotifications(response.items || []);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };

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
    return <div className="text-center">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="text-center text-gray-600">No notifications</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-[#7C3AED] hover:text-[#6D28D9]"
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg bg-white p-4 shadow-lg transition-colors ${
              !notification.isRead ? 'bg-purple-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="mt-1 text-gray-600">{notification.message}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="ml-4 text-sm text-[#7C3AED] hover:text-[#6D28D9]"
                >
                  Mark as read
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
