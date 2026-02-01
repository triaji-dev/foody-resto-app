'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchRestaurants } from './restaurant.queries';
import type { Restaurant } from '@/types/api';

interface UsePaginatedRestaurantsOptions {
  query?: string;
  initialLimit?: number;
}

interface UsePaginatedRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
  handleShowMore: () => Promise<void>;
  reset: () => void;
}

export function usePaginatedRestaurants({
  query = '',
  initialLimit = 12,
}: UsePaginatedRestaurantsOptions = {}): UsePaginatedRestaurantsReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [additionalRestaurants, setAdditionalRestaurants] = useState<
    Restaurant[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const prevQueryRef = useRef(query);

  const { data, isLoading, error, refetch } = useSearchRestaurants(
    query,
    currentPage,
    initialLimit
  );

  // Reset when query changes to a DIFFERENT value
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query;
      setCurrentPage(1);
      setAdditionalRestaurants([]);
      setIsLoadingMore(false);
    }
  }, [query]);

  // Accumulate additional pages (page 2+)
  useEffect(() => {
    if (currentPage > 1 && data?.restaurants) {
      setAdditionalRestaurants((prev) => [...prev, ...data.restaurants]);
    }
  }, [data, currentPage]);

  // Compute displayed restaurants: page 1 from React Query + additional pages from state
  const restaurants = useMemo(() => {
    if (currentPage === 1) {
      return data?.restaurants ?? [];
    }
    const firstPageData = data?.restaurants ?? [];
    return [...firstPageData, ...additionalRestaurants];
  }, [data, currentPage, additionalRestaurants]);

  const hasMore = Boolean(
    data?.pagination && currentPage < data.pagination.totalPages
  );

  const totalResults = data?.pagination?.total ?? 0;

  const handleShowMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      setCurrentPage((prev) => prev + 1);
      await refetch();
    } catch (err) {
      console.error('Error loading more restaurants:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, refetch]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setAdditionalRestaurants([]);
    setIsLoadingMore(false);
  }, []);

  return {
    restaurants,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    hasMore,
    currentPage,
    totalResults,
    handleShowMore,
    reset,
  };
}
