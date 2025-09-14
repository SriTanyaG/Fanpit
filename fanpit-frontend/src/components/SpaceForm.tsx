'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { spaceService } from '@/services/space.service';
import type { Space, CreateSpaceRequest } from '@/types/api.types';

interface SpaceFormProps {
  space?: Space;
  onSubmit?: (space: Space) => void;
}

export default function SpaceForm({ space, onSubmit }: SpaceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: space?.name || '',
    description: space?.description || '',
    address: space?.address || '',
    type: space?.type || 'event',
    capacity: space?.capacity || 1,
    amenities: space?.amenities || [],
    images: space?.images || [],
    location: space?.location || { coordinates: [0, 0] },
    // Pricing Engine Features
    isFree: space?.isFree || false,
    basePrice: space?.basePrice || 1000,
    dayRate: space?.dayRate || 0,
    peakHours: space?.peakHours || [],
    timeBlocks: space?.timeBlocks || [],
    promoCodes: space?.promoCodes || [],
    specialEvents: space?.specialEvents || [],
    // Reservation Workflow
    availabilityCalendar: space?.availabilityCalendar || {},
    dynamicPricing: space?.dynamicPricing || false,
    minBookingDuration: space?.minBookingDuration || 1,
    maxBookingDuration: space?.maxBookingDuration || 24,
    advanceBookingDays: space?.advanceBookingDays || 30,
    cancellationPolicy: space?.cancellationPolicy || '24h',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.address) {
        setError('Name and address are required fields');
        setLoading(false);
        return;
      }
      
      // Ensure proper data structure for API
      const spaceData = {
        ...formData,
        // Ensure all required fields are present with proper defaults
        location: formData.location || { coordinates: [0, 0] },
        isFree: formData.isFree !== undefined ? formData.isFree : false,
        basePrice: formData.basePrice || 1000,
        dayRate: formData.dayRate || 0,
        peakHours: formData.peakHours || [],
        timeBlocks: formData.timeBlocks || [],
        promoCodes: formData.promoCodes || [],
        specialEvents: formData.specialEvents || [],
        dynamicPricing: formData.dynamicPricing !== undefined ? formData.dynamicPricing : false,
        minBookingDuration: formData.minBookingDuration || 1,
        maxBookingDuration: formData.maxBookingDuration || 24,
        advanceBookingDays: formData.advanceBookingDays || 30,
        cancellationPolicy: formData.cancellationPolicy || '24h',
        availabilityCalendar: formData.availabilityCalendar || {}
      };
      
      console.log('Submitting space data:', spaceData);
      
      let result;
      if (space) {
        result = await spaceService.updateSpace(space.id, spaceData);
      } else {
        result = await spaceService.createSpace(spaceData as CreateSpaceRequest);
      }

      if (onSubmit) {
        onSubmit(result);
      } else {
        router.push('/dashboard/spaces');
      }
    } catch (err: any) {
      console.error('Space form error:', err);
      setError(err.message || 'Failed to save space');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      // TODO: Implement image upload
      const urls = ['https://placeholder.com/image.jpg'];
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err: any) {
      setError('Failed to upload images');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            step="any"
            value={formData.location.coordinates[1]}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                coordinates: [prev.location.coordinates[0], parseFloat(e.target.value) || 0]
              }
            }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            step="any"
            value={formData.location.coordinates[0]}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                coordinates: [parseFloat(e.target.value) || 0, prev.location.coordinates[1]]
              }
            }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        >
          <option value="event">Event</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amenities
        </label>
        <div className="mt-2 space-y-2">
          {['WiFi', 'Parking', 'Air Conditioning', 'Catering', 'Sound System'].map(
            (amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenitiesChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span className="ml-2 text-sm text-gray-600">{amenity}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Pricing Engine Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Engine</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFree"
              checked={formData.isFree}
              onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
            />
            <label htmlFor="isFree" className="ml-2 text-sm text-gray-700">
              This space is free
            </label>
          </div>

          {!formData.isFree && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Price (₹)</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Day Rate (₹)</label>
                  <input
                    type="number"
                    name="dayRate"
                    value={formData.dayRate}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dynamicPricing"
                  checked={formData.dynamicPricing}
                  onChange={(e) => setFormData(prev => ({ ...prev, dynamicPricing: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <label htmlFor="dynamicPricing" className="ml-2 text-sm text-gray-700">
                  Enable dynamic pricing (peak/off-peak multipliers)
                </label>
              </div>

              {formData.dynamicPricing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Peak Hours (24h format)</label>
                    <input
                      type="text"
                      placeholder="e.g., 9:00-17:00"
                      value={formData.peakHours.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        peakHours: e.target.value.split(',').map(h => h.trim()).filter(h => h)
                      }))}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Peak Multiplier</label>
                    <input
                      type="number"
                      placeholder="1.5"
                      min="1"
                      step="0.1"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Time Block Bundles</label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Bundle name (e.g., Morning Package)"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                    <input
                      type="text"
                      placeholder="Time range (e.g., 6:00-12:00)"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      min="0"
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                    <button
                      type="button"
                      className="rounded-lg bg-[#7C3AED] px-3 py-2 text-white hover:bg-[#6D28D9]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Promo Codes</label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code (e.g., WELCOME20)"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                    <select className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]">
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Value"
                      min="0"
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                    <button
                      type="button"
                      className="rounded-lg bg-[#7C3AED] px-3 py-2 text-white hover:bg-[#6D28D9]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reservation Workflow Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Workflow</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Booking Duration (hours)</label>
              <input
                type="number"
                name="minBookingDuration"
                value={formData.minBookingDuration}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Booking Duration (hours)</label>
              <input
                type="number"
                name="maxBookingDuration"
                value={formData.maxBookingDuration}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Advance Booking (days)</label>
              <input
                type="number"
                name="advanceBookingDays"
                value={formData.advanceBookingDays}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
            <select
              name="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            >
              <option value="24h">24 hours before</option>
              <option value="48h">48 hours before</option>
              <option value="7d">7 days before</option>
              <option value="no">No cancellation</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#7C3AED] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#6D28D9]"
        />
        {formData.images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {formData.images.map((url, index) => (
              <div key={index} className="relative h-24">
                <img
                  src={url}
                  alt={`Space image ${index + 1}`}
                  className="h-full w-full rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }
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
          </div>
        )}
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
          disabled={loading}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9] disabled:opacity-50"
        >
          {loading ? 'Saving...' : space ? 'Update Space' : 'Create Space'}
        </button>
      </div>
    </form>
  );
}
