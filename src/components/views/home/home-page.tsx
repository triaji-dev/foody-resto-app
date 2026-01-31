'use client';

import { GeolocationProvider } from '@/components/providers/geolocation-provider';
import Hero from './components/hero';
import HomeMenu from './components/home-menu';
import Recommended from './components/recommended';
import SearchResult from './components/search-result';
import { useHomePage } from '@/hooks/use-home-page';

export default function HomePage() {
  const {
    showSearchMode,
    searchQuery,
    hasSearched,
    handleSearch,
    clearSearch,
    setSearchComplete,
    handleSearchFromRecommended,
    hideSearchMode,
  } = useHomePage();

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
            onClearSearch={hideSearchMode}
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
