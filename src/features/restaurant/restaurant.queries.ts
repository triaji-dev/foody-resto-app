'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { restaurantService } from '@/services/restaurant';
import type {
  Restaurant,
  RestaurantDetail,
  RestaurantFilters,
} from '@/types/api';

// ============================================
// QUERY KEYS - Centralized cache key management
// ============================================
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

// ============================================
// HOOKS - TanStack Query hooks with full states
// ============================================

/**
 * Get restaurants list with optional filters
 * Returns: { data, isLoading, isError, error, isFetching, isSuccess, refetch }
 */
export function useRestaurants(filters?: RestaurantFilters) {
  return useQuery({
    queryKey: restaurantKeys.list(filters || {}),
    queryFn: async () => {
      const response = await restaurantService.getRestaurants(filters);
      return response.data; // ApiResponse.data = { restaurants, pagination }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });
}

/**
 * Get restaurant detail with menus and reviews
 */
export function useRestaurantDetail(
  id: number,
  options?: { limitMenu?: number; limitReview?: number }
) {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: async () => {
      const response = await restaurantService.getRestaurantDetail(id, options);
      return response.data;
    },
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get best seller restaurants
 */
export function useBestSellers(
  page: number = 1,
  limit: number = 20,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...restaurantKeys.bestSellers(), { page, limit }],
    queryFn: async () => {
      const response = await restaurantService.getBestSellers({ page, limit });
      return response.data; // { restaurants, pagination }
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

/**
 * Search restaurants by name
 */
export function useSearchRestaurants(
  query: string,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: [...restaurantKeys.search(query), { page, limit }],
    queryFn: async () => {
      const response = await restaurantService.searchRestaurants({
        q: query,
        page,
        limit,
      });
      return response.data;
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get nearby restaurants (requires auth)
 */
export function useNearbyRestaurants(range: number = 10, limit: number = 20) {
  return useQuery({
    queryKey: [...restaurantKeys.nearby(), { range, limit }],
    queryFn: async () => {
      const response = await restaurantService.getNearby({ range, limit });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1, // Minimize retries for auth-required endpoints
  });
}

/**
 * Get recommended restaurants (requires auth)
 */
export function useRecommendedRestaurants(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.recommended(),
    queryFn: async () => {
      const response = await restaurantService.getRecommended();
      return response.data; // { recommendations }
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
    retry: 1,
  });
}

// ============================================
// URL SYNC HOOK - Sync filters with URL params
// ============================================
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
