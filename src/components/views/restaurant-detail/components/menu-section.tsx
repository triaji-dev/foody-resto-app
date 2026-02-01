'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MenuItemCard from './menu-item-card';
import type { Menu } from '@/types/api';

interface MenuSectionProps {
  menus: Menu[];
  onAddToCart?: (menuId: number, quantity: number) => void;
  initialLimit?: number;
}

type CategoryFilter = 'all' | 'food' | 'drink';

export default function MenuSection({
  menus,
  onAddToCart,
  initialLimit = 8,
}: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [displayLimit, setDisplayLimit] = useState(initialLimit);

  // Filter menus by category
  const filteredMenus = menus.filter((menu) => {
    if (activeCategory === 'all') return true;
    return menu.category?.toLowerCase() === activeCategory;
  });

  const displayedMenus = filteredMenus.slice(0, displayLimit);
  const hasMore = displayLimit < filteredMenus.length;

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + 8);
  };

  const handleCategoryChange = (category: CategoryFilter) => {
    setActiveCategory(category);
    setDisplayLimit(initialLimit);
  };

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All Menu' },
    { value: 'food', label: 'Food' },
    { value: 'drink', label: 'Drink' },
  ];

  return (
    <section className='bg-white'>
      {/* Section Header */}
      <h2 className='mb-4 text-2xl font-extrabold text-gray-900 md:mb-6 md:text-4xl md:leading-none'>
        Menu
      </h2>

      {/* Category Filter Buttons */}
      <div className='mb-4 flex gap-2 md:mb-6 md:gap-3'>
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === category.value
                ? 'border border-[#C12116] bg-[#FFECEC] text-[#C12116]'
                : 'border border-[#D5D7DA] bg-transparent text-gray-900 hover:border-gray-400'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {displayedMenus.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5'>
          {displayedMenus.map((menu) => (
            <MenuItemCard key={menu.id} menu={menu} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className='rounded-xl bg-neutral-100 py-12 text-center'>
          <p className='text-base text-neutral-500'>No menu items found</p>
        </div>
      )}

      {/* Show More Button */}
      {hasMore && (
        <div className='mt-6 flex justify-center md:mt-8'>
          <Button
            variant='outline'
            onClick={handleShowMore}
            className='rounded-full border-[#D5D7DA] px-8 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
          >
            Show More
          </Button>
        </div>
      )}
    </section>
  );
}
