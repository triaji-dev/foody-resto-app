'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Restaurant, Menu } from '@/types/api';

export function useSearchState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setHasSearched(!!query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setHasSearched(false);
  }, []);

  const setSearchComplete = useCallback(() => {
    // Optional: Logic to run when search finishes
  }, []);

  return {
    searchQuery,
    hasSearched,
    handleSearch,
    clearSearch,
    setSearchComplete,
  };
}

export function useSearchSuggestions(query: string) {
  const [data, setData] = useState<
    { id: string; text: string; type: string }[]
  >([]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setData([]);
      return;
    }
    // Mock suggestions
    const mockSuggestions = [
      { id: '1', text: `${query} Restaurant`, type: 'restaurant' },
      { id: '2', text: `Best ${query}`, type: 'dish' },
      { id: '3', text: `${query} Cuisine`, type: 'cuisine' },
    ];
    setData(mockSuggestions);
  }, [query]);

  return { data };
}

export function useSearchRestaurants({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}) {
  // Mock data fetching
  const [data, setData] = useState<{
    restaurants: Restaurant[];
    pagination: { totalPages: number; total: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
      // Return mock restaurants
      const mockRestaurants: Restaurant[] = Array.from({ length: limit }).map(
        (_, i) => ({
          id: i + (page - 1) * limit + 1,
          name: `${query || 'Restaurant'} ${i + 1} (Page ${page})`,
          place: 'Jakarta',
          star: 4.5,
          logo: '/images/restaurant-placeholder.jpg',
          images: ['/images/restaurant-placeholder.jpg'],
          reviewCount: 100,
          menuCount: 20,
          priceRange: { min: 20000, max: 100000 },
          isOpen: true,
        })
      );

      setData({
        restaurants: mockRestaurants,
        pagination: { totalPages: 5, total: 50 },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, page, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useSearchMenus({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}) {
  // Mock menu searching
  const [data, setData] = useState<{
    menus: Menu[];
    pagination: { totalPages: number; total: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockMenus: Menu[] = Array.from({ length: limit }).map((_, i) => ({
        id: i + (page - 1) * limit + 1,
        name: `${query || 'Dish'} ${i + 1}`,
        price: 50000,
        description: 'Delicious food item description.',
        image: '/images/menu-placeholder.jpg',
        category: 'Main Course',
      }));

      setData({
        menus: mockMenus,
        pagination: { totalPages: 5, total: 50 },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, page, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
