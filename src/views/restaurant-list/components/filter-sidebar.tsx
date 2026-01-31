'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className='flex flex-col gap-[10px] border-b border-neutral-100 pb-4 last:border-none'>
    <h3 className='text-lg font-extrabold text-neutral-900'>{title}</h3>
    <div className='flex flex-col gap-3'>{children}</div>
  </div>
);

const CheckboxItem = ({
  label,
  id,
  defaultChecked = false,
}: {
  label: React.ReactNode;
  id: string;
  defaultChecked?: boolean;
}) => (
  <label
    htmlFor={id}
    className='group flex cursor-pointer items-center gap-[10px]'
  >
    <div className='relative flex items-center justify-center'>
      <input
        type='checkbox'
        id={id}
        defaultChecked={defaultChecked}
        className='peer checked:bg-primary checked:border-primary h-5 w-5 appearance-none rounded border border-neutral-400 transition-all'
      />
      <svg
        className='pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='4'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
      </svg>
    </div>
    <span className='text-md text-neutral-600 transition-colors group-hover:text-neutral-900'>
      {label}
    </span>
  </label>
);

interface FilterSidebarProps {
  isSheet?: boolean;
}

export function FilterSidebar({ isSheet = false }: FilterSidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-fit w-full flex-col gap-[10px]',
        isSheet
          ? ''
          : 'rounded-2xl bg-white p-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] lg:w-72'
      )}
    >
      <h2 className='text-md font-extrabold text-neutral-900'>FILTER</h2>

      <FilterSection title='Distance'>
        <CheckboxItem id='nearby' label='Nearby' defaultChecked />
        <CheckboxItem id='within-1km' label='Within 1 km' />
        <CheckboxItem id='within-3km' label='Within 3 km' />
        <CheckboxItem id='within-5km' label='Within 5 km' />
      </FilterSection>

      <FilterSection title='Price'>
        <div className='flex flex-col gap-3'>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 w-[38px] -translate-y-1/2 rounded-sm bg-neutral-100 p-2 text-center font-medium text-neutral-950'>
              Rp
            </span>
            <input
              type='text'
              placeholder='Minimum Price'
              className='focus:ring-primary/20 focus:border-primary placeholder:text-md w-full rounded-lg border border-neutral-300 py-3 pr-4 pl-13 text-sm transition-all focus:ring-2 focus:outline-none'
            />
          </div>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 w-[38px] -translate-y-1/2 rounded-sm bg-neutral-100 p-2 text-center font-medium text-neutral-950'>
              Rp
            </span>
            <input
              type='text'
              placeholder='Maximum Price'
              className='focus:ring-primary/20 focus:border-primary placeholder:text-md w-full rounded-lg border border-neutral-200 py-3 pr-4 pl-13 text-sm transition-all focus:ring-2 focus:outline-none'
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title='Rating'>
        {[5, 4, 3, 2, 1].map((rating) => (
          <CheckboxItem
            key={rating}
            id={`rating-${rating}`}
            label={
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>{rating}</span>
              </div>
            }
          />
        ))}
      </FilterSection>
    </aside>
  );
}
