'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SearchbarProps {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  defaultValue?: string;
}

function Searchbar({ onSearch, onClear, defaultValue = '' }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch?.(searchValue.trim());
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    onClear?.();
  };

  // Update search value when defaultValue changes
  React.useEffect(() => {
    setSearchValue(defaultValue);
  }, [defaultValue]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      className='relative mx-auto w-full max-w-[604px]'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className='relative'>
        {/* Search Icon */}
        <motion.div
          className={`absolute top-1/2 left-4 z-10 -translate-y-1/2 transform ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`}
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
          className={`w-full rounded-full border py-4 pr-16 pl-12 text-black backdrop-blur-md transition-all duration-300 placeholder:text-neutral-600 placeholder:text-sm-regular md:placeholder:text-md-regular focus:ring-2 focus:outline-none focus:placeholder:text-neutral-400 ${
            isFocused
              ? 'bg-background border-primary ring-primary/50 shadow-[0_10px_25px_rgba(0,0,0,0.1),0_0_0_1px_var(--primary)]'
              : 'border-border bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]'
          }`}
          transition={{ duration: 0.3 }}
        />

        {/* Clear Button */}
        {searchValue && (
          <motion.button
            type='button'
            onClick={handleClear}
            className='text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer p-1 transition-colors'
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
    </motion.form>
  );
}

export default Searchbar;
