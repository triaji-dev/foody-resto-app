'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchRestaurants, useSearchMenus } from './use-search';
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
  const [displayedRestaurants, setDisplayedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch restaurants
  const {
    data: restaurantData,
    isLoading: restaurantLoading,
    error: restaurantError,
    refetch: refetchRestaurants,
  } = useSearchRestaurants({
    query,
    page: currentPage,
    limit: initialLimit,
  });

  // Fetch menus
  const {
    data: menuData,
    isLoading: menuLoading,
    error: menuError,
    refetch: refetchMenus,
  } = useSearchMenus({
    query,
    page: currentPage,
    limit: initialLimit,
  });

  const isLoading = restaurantLoading || menuLoading;
  const error = restaurantError || menuError;

  // Update displayed restaurants when data changes
  useEffect(() => {
    if (restaurantData?.restaurants) {
      if (currentPage === 1) {
        setDisplayedRestaurants(restaurantData.restaurants);
      } else {
        setDisplayedRestaurants((prev) => [
          ...prev,
          ...restaurantData.restaurants,
        ]);
      }
    }
  }, [restaurantData, currentPage]);

  // Auto scroll to results on first load
  useEffect(() => {
    if (
      autoScrollOnLoad &&
      !isLoading &&
      (restaurantData?.restaurants || menuData?.menus) &&
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
  }, [isLoading, restaurantData, menuData, currentPage, autoScrollOnLoad]);

  // Reset when query changes
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedRestaurants([]);
    setIsLoadingMore(false);
  }, [query]);

  const menus = menuData?.menus ?? [];

  const hasMoreRestaurants = Boolean(
    restaurantData?.pagination &&
    currentPage < restaurantData.pagination.totalPages &&
    restaurantData.pagination.total > initialLimit
  );

  const hasMoreMenus = Boolean(
    menuData?.pagination &&
    currentPage < menuData.pagination.totalPages &&
    menuData.pagination.total > initialLimit
  );

  const hasMore = hasMoreRestaurants || hasMoreMenus;
  const totalRestaurants = restaurantData?.pagination?.total ?? 0;
  const totalMenus = menuData?.pagination?.total ?? 0;

  const handleShowMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      setCurrentPage((prev) => prev + 1);
      await Promise.all([refetchRestaurants(), refetchMenus()]);
    } catch (err) {
      console.error('Error loading more results:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, refetchRestaurants, refetchMenus]);

  const refetchAll = useCallback(async () => {
    await Promise.all([refetchRestaurants(), refetchMenus()]);
  }, [refetchRestaurants, refetchMenus]);

  return {
    restaurants: displayedRestaurants,
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
