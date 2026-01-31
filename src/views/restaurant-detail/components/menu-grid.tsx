'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuItem from './menu-item';
import type { Menu } from '@/types/api';

interface MenuGridProps {
  menus: Menu[];
  restaurantId: number;
  onAddToCart?: (menuId: number, quantity: number) => void;
}

export default function MenuGrid({
  menus,
  restaurantId,
  onAddToCart,
}: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Extract unique categories from menus
  const categories = useMemo(() => {
    const uniqueCategories = new Set(menus.map((menu) => menu.category));
    return ['all', ...Array.from(uniqueCategories).filter(Boolean)];
  }, [menus]);

  // Filter menus by selected category
  const filteredMenus = useMemo(() => {
    if (activeCategory === 'all') return menus;
    return menus.filter((menu) => menu.category === activeCategory);
  }, [menus, activeCategory]);

  if (menus.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>No menu items available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Category tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className='w-full'
      >
        <TabsList className='flex h-auto flex-wrap gap-2 bg-transparent p-0'>
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border px-4 py-2 capitalize data-[state=active]:border-transparent'
            >
              {category === 'all' ? 'All Menu' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Menu grid */}
        <TabsContent value={activeCategory} className='mt-6'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredMenus.map((menu) => (
              <MenuItem
                key={menu.id}
                menu={menu}
                onAddToCart={
                  onAddToCart
                    ? (quantity) => onAddToCart(menu.id, quantity)
                    : undefined
                }
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Show count */}
      <p className='text-muted-foreground text-sm-custom'>
        Showing {filteredMenus.length} of {menus.length} items
      </p>
    </div>
  );
}
