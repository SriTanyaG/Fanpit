'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewService } from '@/services/review.service';
import type { Review } from '@/types/api.types';
import { format } from 'date-fns';

interface ReviewListProps {
  spaceId: string;
  onDelete?: () => void;
}

export default function ReviewList({ spaceId, onDelete }: ReviewListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReviews();
  }, [page, spaceId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews({
        page,
        spaceId
      });
      setReviews(response.items || []);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.deleteReview(id);
      if (onDelete) {
        onDelete();
      }
      await loadReviews();
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-lg">
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
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
    return <div className="text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-gray-600">No reviews yet</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.user.name}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              {renderStars(review.rating)}
            </div>
            {(user?.id === review.user.id || user?.role === 'admin') && (
              <button
                onClick={() => handleDelete(review.id)}
                className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-4 whitespace-pre-wrap text-gray-700">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      ))}
      {renderPagination()}
    </div>
  );
}
