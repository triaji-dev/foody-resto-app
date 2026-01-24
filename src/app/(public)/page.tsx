'use client';

import React, { useState } from 'react';
import Hero from '@/components/views/home/hero';
import HomeMenu from '@/components/views/home/home-menu';
import Recommended from '@/components/views/home/recommended';
import SearchResult from '@/components/views/home/search-result';
import { useSearchState } from '@/hooks/use-search';
import { GeolocationProvider } from '@/components/providers/geolocation-provider';

export default function Home() {
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
          <Recommended onToggleSearchMode={handleToggleSearchMode} />
        )}
      </div>
    </GeolocationProvider>
  );
}
