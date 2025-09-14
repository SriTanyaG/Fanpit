import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationDetails {
  coordinates: Coordinates;
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

@Injectable()
export class LocationService {
  private readonly geocodingApiKey: string;
  private readonly geocodingApiUrl: string;

  constructor(private configService: ConfigService) {
    this.geocodingApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') || '';
    this.geocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  async geocodeAddress(address: string): Promise<LocationDetails> {
    try {
      const response = await axios.get(this.geocodingApiUrl, {
        params: {
          address,
          key: this.geocodingApiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new BadRequestException('Failed to geocode address');
      }

      const result = response.data.results[0];
      const { lat, lng } = result.geometry.location;

      // Extract address components
      const addressComponents = this.parseAddressComponents(result.address_components);

      return {
        coordinates: {
          latitude: lat,
          longitude: lng
        },
        formattedAddress: result.formatted_address,
        ...addressComponents
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error geocoding address');
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<LocationDetails> {
    try {
      const response = await axios.get(this.geocodingApiUrl, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.geocodingApiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new BadRequestException('Failed to reverse geocode coordinates');
      }

      const result = response.data.results[0];
      const addressComponents = this.parseAddressComponents(result.address_components);

      return {
        coordinates: { latitude, longitude },
        formattedAddress: result.formatted_address,
        ...addressComponents
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error reverse geocoding coordinates');
    }
  }

  async calculateDistance(
    origin: Coordinates,
    destination: Coordinates
  ): Promise<number> {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(destination.latitude - origin.latitude);
    const dLon = this.toRad(destination.longitude - origin.longitude);
    const lat1 = this.toRad(origin.latitude);
    const lat2 = this.toRad(destination.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async findNearbySpaces(
    coordinates: Coordinates,
    radiusKm: number
  ): Promise<{ longitude: number; latitude: number }[]> {
    // This method would typically use MongoDB's $geoNear aggregation
    // The actual implementation would be in the space service
    return [];
  }

  private parseAddressComponents(components: any[]): {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  } {
    const result = {
      city: '',
      state: '',
      country: '',
      postalCode: ''
    };

    components.forEach(component => {
      const types = component.types;

      if (types.includes('locality')) {
        result.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        result.state = component.long_name;
      } else if (types.includes('country')) {
        result.country = component.long_name;
      } else if (types.includes('postal_code')) {
        result.postalCode = component.long_name;
      }
    });

    return result;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

