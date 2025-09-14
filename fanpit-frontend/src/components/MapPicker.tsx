'use client';

import { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation?: [number, number] | null;
  height?: string;
}

export default function MapPicker({ onLocationSelect, initialLocation, height = '400px' }: MapPickerProps) {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState<[number, number]>([12.9716, 77.5946]); // Default to Bangalore
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    if (initialLocation) {
      setPosition(initialLocation);
    }
  }, [initialLocation]);

  // Component to handle map events
  function MapEvents() {
    const map = useMap();
    
    useEffect(() => {
      const handleClick = async (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Reverse geocoding using OpenStreetMap Nominatim API
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationSelect(lat, lng, address);
        } catch (error) {
          console.error('Geocoding error:', error);
          onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      };

      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }, [map, onLocationSelect]);

    return null;
  }

  if (!isClient) {
    return (
      <div 
        style={{ height }} 
        className="flex items-center justify-center rounded-lg bg-gray-100"
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div>
              <p className="font-semibold">Selected Location</p>
              <p className="text-sm text-gray-600">Click anywhere on the map to select a location</p>
            </div>
          </Popup>
        </Marker>
        <MapEvents />
      </MapContainer>
    </div>
  );
}