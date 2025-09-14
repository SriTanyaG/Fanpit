'use client';

import { useState, useRef } from 'react';
import { uploadService } from '@/services/upload.service';

interface ImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  className = ''
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length + value.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images`);
      return;
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Each file must be less than 5MB');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const urls = await uploadService.uploadImages(files);
      onChange?.([...value, ...urls]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange?.(newUrls);
  };

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative h-24">
            <img
              src={url}
              alt={`Uploaded image ${index + 1}`}
              className="h-full w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <label className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-[#7C3AED]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            {loading ? (
              <div className="text-sm text-gray-500">Uploading...</div>
            ) : (
              <div className="text-center text-sm text-gray-500">
                <svg
                  className="mx-auto h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add Images</span>
              </div>
            )}
          </label>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Upload up to {maxFiles} images (max 5MB each)
      </p>
    </div>
  );
}
