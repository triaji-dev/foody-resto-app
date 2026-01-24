'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchSuggestions } from '@/hooks/use-search';

interface SearchbarProps {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  defaultValue?: string;
}

function Searchbar({ onSearch, onClear, defaultValue = '' }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Safely default to empty array if hook returns undefined
  const { data: suggestions = [] } = useSearchSuggestions(searchValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch?.(searchValue.trim());
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setSearchValue(suggestionText);
    onSearch?.(suggestionText);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchValue('');
    setShowSuggestions(false);
    onClear?.();
  };

  // Update search value when defaultValue changes
  React.useEffect(() => {
    setSearchValue(defaultValue);
  }, [defaultValue]);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  useEffect(() => {
    setShowSuggestions(isFocused && searchValue.length >= 2);
  }, [isFocused, searchValue]);

  return (
    <motion.form
      onSubmit={handleSearch}
      className='relative mx-auto w-full max-w-2xl'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className='relative'>
        {/* Search Icon */}
        <motion.div
          className='absolute top-1/2 left-4 z-10 -translate-y-1/2 transform'
          style={{
            color: isFocused ? 'var(--primary)' : 'var(--muted-foreground)',
          }}
          animate={{
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </motion.div>

        {/* Input Field */}
        <motion.input
          type='text'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder='Search restaurants, food, and drink...'
          className='text-foreground bg-background/80 border-border placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-full border py-4 pr-16 pl-12 backdrop-blur-md transition-all duration-300 focus:ring-2 focus:outline-none'
          style={{
            backgroundColor: isFocused
              ? 'var(--background)'
              : 'rgba(255, 255, 255, 0.9)',
            borderColor: isFocused ? 'var(--primary)' : 'var(--border)',
            boxShadow: isFocused
              ? '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--primary)'
              : '0 4px 6px rgba(0, 0, 0, 0.05)',
            color: 'black',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Search Button */}
        <motion.button
          type='submit'
          className='bg-primary hover:bg-primary/90 text-primary-foreground absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-2 rounded-full px-2 py-2 font-semibold transition-colors duration-200'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!searchValue.trim()}
        >
          <svg
            className='h-7 w-7'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 7l5 5m0 0l-5 5m5-5H6'
            />
          </svg>
        </motion.button>

        {/* Clear Button */}
        {searchValue && (
          <motion.button
            type='button'
            onClick={handleClear}
            className='text-muted-foreground hover:text-foreground absolute top-1/2 right-16 -translate-y-1/2 transform p-1 transition-colors'
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className='bg-background border-border absolute top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border shadow-lg'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className='py-2'>
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  type='button'
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className='text-foreground hover:bg-muted flex w-full items-center gap-3 px-4 py-3 text-left transition-colors'
                  whileHover={{ backgroundColor: 'var(--muted)' }}
                >
                  <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                    {suggestion.type === 'restaurant' && (
                      <svg
                        className='text-primary h-4 w-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                    {suggestion.type === 'dish' && (
                      <svg
                        className='text-primary h-4 w-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                      </svg>
                    )}
                    {suggestion.type === 'cuisine' && (
                      <svg
                        className='text-primary h-4 w-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{suggestion.text}</p>
                    <p className='text-muted-foreground text-xs capitalize'>
                      {suggestion.type}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

export default Searchbar;
