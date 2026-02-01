import type { Restaurant } from '@/types/api';

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Mock coordinates based on place name
export function getMockCoordinates(place?: string): {
  lat: number;
  lng: number;
} {
  const baseCoords = {
    lat: -6.2088 + (Math.random() - 0.5) * 0.1,
    lng: 106.8456 + (Math.random() - 0.5) * 0.1,
  };

  if (!place) return baseCoords;

  const placeMappings: Record<string, { lat: number; lng: number }> = {
    Jakarta: { lat: -6.2088, lng: 106.8456 },
    'Jakarta Selatan': { lat: -6.2615, lng: 106.8106 },
    'Jakarta Pusat': { lat: -6.1862, lng: 106.8341 },
    'Jakarta Barat': { lat: -6.1484, lng: 106.7588 },
    'Jakarta Timur': { lat: -6.225, lng: 106.9004 },
    'Jakarta Utara': { lat: -6.1214, lng: 106.9323 },
    Bandung: { lat: -6.9175, lng: 107.6191 },
    Surabaya: { lat: -7.2575, lng: 112.7521 },
  };

  for (const [key, coords] of Object.entries(placeMappings)) {
    if (place.toLowerCase().includes(key.toLowerCase())) {
      return {
        lat: coords.lat,
        lng: coords.lng,
      };
    }
  }

  return baseCoords;
}
