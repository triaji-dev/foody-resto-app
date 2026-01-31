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
    setDisplayLimit(initialLimit); // Reset limit when changing category
  };

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All Menu' },
    { value: 'food', label: 'Food' },
    { value: 'drink', label: 'Drink' },
  ];

  return (
    <section className='bg-white py-8 md:py-12'>
      <div className='px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <h2 className='display-sm md:display-md mb-6 font-extrabold text-neutral-950'>
          Menu
        </h2>

        {/* Category Tabs */}
        <div className='mb-6 flex gap-2 md:gap-3'>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`text-sm-custom md:text-md-custom cursor-pointer rounded-full px-4 py-2 font-medium transition-colors md:px-5 ${
                activeCategory === category.value
                  ? 'bg-primary text-white'
                  : 'border border-neutral-600 bg-transparent text-neutral-300 hover:border-neutral-400 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {displayedMenus.length > 0 ? (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4'>
            {displayedMenus.map((menu) => (
              <MenuItemCard
                key={menu.id}
                menu={menu}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className='rounded-xl bg-neutral-800 py-12 text-center'>
            <p className='text-md-custom text-neutral-400'>
              No menu items found
            </p>
          </div>
        )}

        {/* Show More Button */}
        {hasMore && (
          <div className='mt-8 flex justify-center'>
            <Button
              variant='outline'
              onClick={handleShowMore}
              className='rounded-full border-neutral-600 px-8 text-neutral-300 hover:border-neutral-400 hover:bg-neutral-800 hover:text-white'
            >
              Show More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
