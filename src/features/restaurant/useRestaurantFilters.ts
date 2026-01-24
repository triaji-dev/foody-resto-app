'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { RestaurantFilters } from '@/services/types/restaurant.types';

export function useRestaurantFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filters from URL
  const filters: RestaurantFilters = {
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

  // Update filters in URL
  const setFilters = useCallback(
    (newFilters: Partial<RestaurantFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when other filters change (unless page is being set)
      if (!('page' in newFilters)) {
        params.set('page', '1');
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Set a single filter value
  const setFilter = useCallback(
    <K extends keyof RestaurantFilters>(
      key: K,
      value: RestaurantFilters[K]
    ) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Clear a specific filter
  const clearFilter = useCallback(
    (key: keyof RestaurantFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return {
    filters,
    setFilters,
    setFilter,
    clearFilters,
    clearFilter,
  };
}
