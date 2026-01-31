'use client';

import { useRouter } from 'next/navigation';
import { useSearchResults } from '@/features/restaurant';
import RestaurantCard from '@/components/ui/restaurant-card';
import MenuCard from '@/components/ui/menu-card';
import SkeletonCard from './skeleton-card';
import Searchbar from './searchbar';
import { useScreenSize } from '@/hooks/use-screen-size';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

interface SearchResultProps {
  searchQuery: string;
  onClearSearch?: () => void;
  onSearchComplete?: () => void;
  onSearch?: (query: string) => void;
}

function SearchResult({
  searchQuery,
  onClearSearch,
  onSearchComplete,
  onSearch,
}: SearchResultProps) {
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const initialLimit = isMobile ? 6 : 12;

  const {
    restaurants,
    menus,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalRestaurants,
    totalMenus,
    handleShowMore,
    refetchAll,
    scrollRef,
  } = useSearchResults({
    query: searchQuery,
    initialLimit,
  });

  if (!isLoading && onSearchComplete) {
    onSearchComplete();
  }

  return (
    <div ref={scrollRef}>
      <div className='mx-auto mb-8 flex max-w-7xl flex-row items-center justify-between px-4 sm:px-6 lg:px-4'>
        <div className='flex-1'>
          <h1 className='display-md font-extrabold'>Search</h1>
        </div>

        <div className='flex items-center gap-4'>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className='text-lg-custom cursor-pointer font-extrabold text-neutral-600 hover:underline'
            >
              Close Search
            </button>
          )}
          <p
            className='text-primary text-lg-custom cursor-pointer font-extrabold hover:underline'
            onClick={() => router.push(ROUTES.RESTAURANTS)}
          >
            See All
          </p>
        </div>
      </div>

      {/* Search bar in results */}
      <div className='mx-auto mb-8 w-full flex-1 px-4 sm:px-6 lg:px-4'>
        <Searchbar
          onSearch={onSearch}
          onClear={onClearSearch}
          defaultValue={searchQuery}
        />
      </div>

      <div className='mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-10 sm:px-6 lg:px-4'>
        {searchQuery && (
          <div>
            <h1 className='display-md font-extrabold'>
              Results for '{searchQuery}'
            </h1>
            {!isLoading && (restaurants.length > 0 || menus.length > 0) && (
              <p className='text-sm-custom mt-1 text-gray-600'>
                Found {totalRestaurants + totalMenus} results
                {restaurants.length > 0 &&
                  ` • ${restaurants.length} restaurants`}
                {menus.length > 0 && ` • ${menus.length} menus`}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: initialLimit }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='py-4 text-center'>
            <p className='text-red-500'>Failed to search</p>
            <button
              onClick={refetchAll}
              className='text-sm-custom mt-2 text-blue-600 hover:underline'
            >
              Try again
            </button>
          </div>
        )}

        {/* Restaurant Results */}
        {restaurants.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl-custom mb-4 font-bold text-gray-900'>
              Restaurants
            </h2>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Menu Results */}
        {menus.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl-custom mb-4 font-bold text-gray-900'>
              Menus
            </h2>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {menus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onClick={() =>
                    console.log('View menu details for:', menu.name)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading More Skeleton Cards */}
        {isLoadingMore && (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: initialLimit }).map((_, index) => (
              <SkeletonCard key={`loading-more-${index}`} />
            ))}
          </div>
        )}

        {/* No Results State */}
        {searchQuery &&
          !isLoading &&
          !error &&
          restaurants.length === 0 &&
          menus.length === 0 && (
            <div className='py-12 text-center'>
              <div className='mb-4'>
                <h3 className='mb-2 text-2xl font-medium text-gray-900'>
                  No results found
                </h3>
              </div>
            </div>
          )}

        {/* Show More Button */}
        {hasMore && (
          <Button
            variant='outline'
            className='mx-auto mt-4 px-10 py-5 shadow-lg'
            onClick={handleShowMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-gray-600'></div>
                Loading...
              </>
            ) : (
              'Show More'
            )}
          </Button>
        )}

        {/* No More Data Message */}
        {!hasMore && (restaurants.length > 0 || menus.length > 0) && (
          <div className='mt-4 text-center'>
            <p className='text-sm-custom text-gray-500'>
              No more results to load
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
