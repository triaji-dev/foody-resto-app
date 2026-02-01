'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchRestaurants } from './restaurant.queries';
import type { Restaurant, Menu } from '@/types/api';

interface UseSearchResultsOptions {
  query: string;
  initialLimit?: number;
  autoScrollOnLoad?: boolean;
}

interface UseSearchResultsReturn {
  restaurants: Restaurant[];
  menus: Menu[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  currentPage: number;
  totalRestaurants: number;
  totalMenus: number;
  handleShowMore: () => Promise<void>;
  refetchAll: () => Promise<void>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function useSearchResults({
  query,
  initialLimit = 12,
  autoScrollOnLoad = true,
}: UseSearchResultsOptions): UseSearchResultsReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [additionalRestaurants, setAdditionalRestaurants] = useState<
    Restaurant[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevQueryRef = useRef(query);

  // Fetch restaurants using real API
  const {
    data: restaurantData,
    isLoading: restaurantLoading,
    error: restaurantError,
    refetch: refetchRestaurants,
  } = useSearchRestaurants(query, currentPage, initialLimit);

  const isLoading = restaurantLoading;
  const error = restaurantError;

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
    if (currentPage > 1 && restaurantData?.restaurants) {
      setAdditionalRestaurants((prev) => [
        ...prev,
        ...restaurantData.restaurants,
      ]);
    }
  }, [restaurantData, currentPage]);

  // Compute displayed restaurants: page 1 from React Query + additional pages from state
  const restaurants = useMemo(() => {
    if (currentPage === 1) {
      return restaurantData?.restaurants ?? [];
    }
    // For pagination, combine first page data with additional pages
    const firstPageData = restaurantData?.restaurants ?? [];
    return [...firstPageData, ...additionalRestaurants];
  }, [restaurantData, currentPage, additionalRestaurants]);

  // Auto scroll to results on first load
  useEffect(() => {
    if (
      autoScrollOnLoad &&
      !isLoading &&
      restaurantData?.restaurants &&
      currentPage === 1 &&
      scrollRef.current
    ) {
      const timeoutId = setTimeout(() => {
        scrollRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, restaurantData, currentPage, autoScrollOnLoad]);

  // No menu search API available
  const menus: Menu[] = [];

  const hasMore = Boolean(
    restaurantData?.pagination &&
    currentPage < restaurantData.pagination.totalPages &&
    restaurantData.pagination.total > initialLimit
  );

  const totalRestaurants = restaurantData?.pagination?.total ?? 0;
  const totalMenus = 0;

  const handleShowMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      setCurrentPage((prev) => prev + 1);
      await refetchRestaurants();
    } catch (err) {
      console.error('Error loading more results:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, refetchRestaurants]);

  const refetchAll = useCallback(async () => {
    await refetchRestaurants();
  }, [refetchRestaurants]);

  return {
    restaurants,
    menus,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    hasMore,
    currentPage,
    totalRestaurants,
    totalMenus,
    handleShowMore,
    refetchAll,
    scrollRef,
  };
}
