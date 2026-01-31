'use client';

import React, { useState, useCallback } from 'react';
import Hero from '@/views/home/components/hero';
import HomeMenu from '@/views/home/components/home-menu';
import Recommended from '@/views/home/components/recommended';
import SearchResult from '@/views/home/components/search-result';
import { useSearchState } from '@/features/restaurant/use-search';
import { GeolocationProvider } from '@/components/providers/geolocation-provider';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function HomePage() {
  const [showSearchMode, setShowSearchMode] = useState(false);

  // Custom hook for scroll-to-top logic
  useScrollToTop();

  const {
    searchQuery,
    hasSearched,
    handleSearch,
    clearSearch,
    setSearchComplete,
  } = useSearchState();

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

  return (
    <GeolocationProvider autoRequest={true}>
      <div className='relative min-h-screen bg-neutral-50'>
        <Hero onSearch={handleSearch} onClearSearch={clearSearch} />
        <HomeMenu />

        {hasSearched && searchQuery ? (
          <SearchResult
            searchQuery={searchQuery}
            onClearSearch={clearSearch}
            onSearchComplete={setSearchComplete}
            onSearch={handleSearch}
          />
        ) : showSearchMode ? (
          <SearchResult
            searchQuery=''
            onClearSearch={() => setShowSearchMode(false)}
            onSearchComplete={setSearchComplete}
            onSearch={handleSearchFromRecommended}
          />
        ) : (
          <Recommended />
        )}
      </div>
    </GeolocationProvider>
  );
}
