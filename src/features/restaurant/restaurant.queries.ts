import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/services/api-client';
import type {
  Restaurant,
  RestaurantDetail,
  RestaurantFilters,
  PaginatedResponse,
} from '@/types/api';

// Query keys for caching
export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: (filters: RestaurantFilters) =>
    [...restaurantKeys.lists(), filters] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: number) => [...restaurantKeys.details(), id] as const,
  bestSellers: () => [...restaurantKeys.all, 'best-sellers'] as const,
  search: (query: string) => [...restaurantKeys.all, 'search', query] as const,
  nearby: () => [...restaurantKeys.all, 'nearby'] as const,
  recommended: () => [...restaurantKeys.all, 'recommended'] as const,
};

// Get restaurants list with filters
export function useRestaurants(filters?: RestaurantFilters) {
  return useQuery({
    queryKey: restaurantKeys.list(filters || {}),
    queryFn: async (): Promise<PaginatedResponse<Restaurant>> => {
      const params = new URLSearchParams();
      if (filters?.location) params.append('location', filters.location);
      if (filters?.range) params.append('range', String(filters.range));
      if (filters?.priceMin)
        params.append('priceMin', String(filters.priceMin));
      if (filters?.priceMax)
        params.append('priceMax', String(filters.priceMax));
      if (filters?.rating) params.append('rating', String(filters.rating));
      if (filters?.category) params.append('category', filters.category);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiClient.get<PaginatedResponse<Restaurant>>(
        `/api/resto?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get restaurant detail with menus and reviews
export function useRestaurantDetail(
  id: number,
  options?: { limitMenu?: number; limitReview?: number }
) {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: async (): Promise<RestaurantDetail> => {
      const params = new URLSearchParams();
      if (options?.limitMenu)
        params.append('limitMenu', String(options.limitMenu));
      if (options?.limitReview)
        params.append('limitReview', String(options.limitReview));

      const queryString = params.toString();
      const url = queryString
        ? `/api/resto/${id}?${queryString}`
        : `/api/resto/${id}`;

      const response = await apiClient.get<RestaurantDetail>(url);
      return response.data;
    },
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Get best seller restaurants
export function useBestSellers(
  page: number = 1,
  limit: number = 20,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...restaurantKeys.bestSellers(), { page, limit }],
    queryFn: async (): Promise<PaginatedResponse<Restaurant>> => {
      const response = await apiClient.get<PaginatedResponse<Restaurant>>(
        `/api/resto/best-seller?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled,
  });
}

// Search restaurants by name
export function useSearchRestaurants(
  query: string,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: restaurantKeys.search(query),
    queryFn: async (): Promise<PaginatedResponse<Restaurant>> => {
      const response = await apiClient.get<PaginatedResponse<Restaurant>>(
        `/api/resto/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return response.data;
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Get nearby restaurants (requires auth)
export function useNearbyRestaurants(range: number = 10, limit: number = 20) {
  return useQuery({
    queryKey: [...restaurantKeys.nearby(), { range, limit }],
    queryFn: async (): Promise<PaginatedResponse<Restaurant>> => {
      const response = await apiClient.get<PaginatedResponse<Restaurant>>(
        `/api/resto/nearby?range=${range}&limit=${limit}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get recommended restaurants (requires auth)
export function useRecommendedRestaurants(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.recommended(),
    queryFn: async (): Promise<Restaurant[]> => {
      const response = await apiClient.get<any>('/api/resto/recommended');
      // Handle potential wrapped response { data: [...] }
      return response.data?.data || response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled,
    retry: 1, // Minimize retries on 403 to reduce console noise
  });
}

// Hook to sync filters with URL params
export function useRestaurantFiltersFromURL(): RestaurantFilters {
  const searchParams = useSearchParams();

  return {
    location: searchParams.get('location') || undefined,
    range: searchParams.get('range')
      ? Number(searchParams.get('range'))
      : undefined,
    priceMin: searchParams.get('priceMin')
      ? Number(searchParams.get('priceMin'))
      : undefined,
    priceMax: searchParams.get('priceMax')
      ? Number(searchParams.get('priceMax'))
      : undefined,
    rating: searchParams.get('rating')
      ? Number(searchParams.get('rating'))
      : undefined,
    category: searchParams.get('category') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
  };
}
