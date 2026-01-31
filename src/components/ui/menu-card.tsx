import { Plus } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Menu } from '@/types/api';

interface MenuCardProps {
  menu: Menu;
  onClick?: () => void;
}

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <Card
      className='group flex h-32 cursor-pointer flex-row overflow-hidden transition-all hover:shadow-md'
      onClick={onClick}
    >
      <div className='relative h-full w-32 shrink-0'>
        <Image
          src={menu.image || '/images/menu-placeholder.jpg'}
          alt={menu.name}
          fill
          className='object-cover'
        />
      </div>
      <CardContent className='flex flex-1 flex-col justify-between p-4'>
        <div>
          <h4 className='group-hover:text-primary line-clamp-1 text-base font-bold transition-colors'>
            {menu.name}
          </h4>
          <p className='text-xs-custom mb-1 line-clamp-1 text-neutral-500'>
            {menu.category}
          </p>
          <p className='text-xs-custom line-clamp-2 text-neutral-400'>
            {menu.description}
          </p>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-sm-custom font-semibold'>
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(menu.price)}
          </span>
          <Button
            size='icon'
            variant='ghost'
            className='bg-primary/10 text-primary hover:bg-primary h-8 w-8 rounded-full hover:text-white'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
