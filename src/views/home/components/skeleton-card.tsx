'use client';

import { useScreenSize } from '@/hooks/use-screen-size';

function SkeletonCard() {
  const { isMobile, isTablet } = useScreenSize();

  const getImageSize = () => {
    if (isMobile) return 'h-20 w-20';
    if (isTablet) return 'h-25 w-25';
    return 'h-30 w-30';
  };

  const nameHeight = isMobile ? 'h-3.5' : 'h-4';
  const smallHeight = isMobile ? 'h-3' : 'h-3.5';
  const cardPadding = isMobile ? 'p-3' : 'p-4';
  const defaultSkeleton = 'animate-pulse bg-gray-200 rounded';

  return (
    <div
      className={`flex items-center gap-3 rounded-xl bg-white shadow-sm ${cardPadding}`}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-md sm:rounded-xl ${getImageSize()} ${defaultSkeleton}`}
      />

      <div className='flex-1 space-y-1'>
        <div className={`${nameHeight} w-3/4 ${defaultSkeleton}`} />

        <div className='flex items-center gap-1'>
          <div className={`${smallHeight} w-3 ${defaultSkeleton}`} />
          <div className={`${smallHeight} w-6 ${defaultSkeleton}`} />
        </div>

        <div className='flex items-center gap-2'>
          <div className={`${smallHeight} w-24 ${defaultSkeleton}`} />
          <div className={`${smallHeight} w-1 ${defaultSkeleton}`} />
          <div className={`${smallHeight} w-12 ${defaultSkeleton}`} />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
