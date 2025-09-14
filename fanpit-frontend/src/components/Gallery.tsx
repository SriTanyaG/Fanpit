'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
  onImageUpload?: (files: FileList) => void;
  onImageRemove?: (index: number) => void;
  canEdit?: boolean;
  maxImages?: number;
}

export default function Gallery({ 
  images, 
  onImageUpload, 
  onImageRemove, 
  canEdit = false, 
  maxImages = 20 
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onImageUpload) {
      onImageUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery</h2>
        {canEdit && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {images.length}/{maxImages} images
            </span>
            {images.length < maxImages && (
              <label className="cursor-pointer rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                Add Images
              </label>
            )}
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">No images yet</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div
                className="aspect-square w-full cursor-pointer overflow-hidden rounded-lg"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              
              {canEdit && onImageRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageRemove(index);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100"
            >
              ×
            </button>
            <Image
              src={images[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              width={800}
              height={600}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

