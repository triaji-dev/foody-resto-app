'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchRestaurants } from './use-search';
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
  const [displayedRestaurants, setDisplayedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error, refetch } = useSearchRestaurants({
    query,
    page: currentPage,
    limit: initialLimit,
  });

  // Update displayed restaurants when data changes
  useEffect(() => {
    if (data?.restaurants) {
      if (currentPage === 1) {
        setDisplayedRestaurants(data.restaurants);
      } else {
        setDisplayedRestaurants((prev) => [...prev, ...data.restaurants]);
      }
    }
  }, [data, currentPage]);

  // Reset when query changes
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedRestaurants([]);
    setIsLoadingMore(false);
  }, [query]);

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
    setDisplayedRestaurants([]);
    setIsLoadingMore(false);
  }, []);

  return {
    restaurants: displayedRestaurants,
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
