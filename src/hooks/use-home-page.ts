'use client';

import { useState, useCallback } from 'react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export function useHomePage() {
  const [showSearchMode, setShowSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useScrollToTop();

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

  const handleToggleSearchMode = useCallback(() => {
    setShowSearchMode((prev) => !prev);
  }, []);

  const handleSearchFromRecommended = useCallback(
    (query: string) => {
      handleSearch(query);
      setShowSearchMode(false);
    },
    [handleSearch]
  );

  const hideSearchMode = useCallback(() => {
    setShowSearchMode(false);
  }, []);

  return {
    // State
    showSearchMode,
    searchQuery,
    hasSearched,

    // Handlers
    handleSearch,
    clearSearch,
    setSearchComplete,
    handleToggleSearchMode,
    handleSearchFromRecommended,
    hideSearchMode,
  };
}
