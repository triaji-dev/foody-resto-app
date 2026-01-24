'use client';

import React, { useState } from 'react';
import Hero from '@/views/home/components/hero';
import HomeMenu from '@/views/home/components/home-menu';
import Recommended from '@/views/home/components/recommended';
import SearchResult from '@/views/home/components/search-result';
import { useSearchState } from '@/features/restaurant/use-search';
import { GeolocationProvider } from '@/components/providers/geolocation-provider';

export default function HomePage() {
  const [showSearchMode, setShowSearchMode] = useState(false);

  const {
    searchQuery,
    hasSearched,
    handleSearch,
    clearSearch,
    setSearchComplete,
  } = useSearchState();

  const handleToggleSearchMode = () => {
    setShowSearchMode(!showSearchMode);
  };

  const handleSearchFromRecommended = (query: string) => {
    handleSearch(query);
    setShowSearchMode(false);
  };

  React.useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Reset scroll position before page unload so browser restores to top
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
