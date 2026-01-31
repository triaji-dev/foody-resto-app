'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewCard from './review-card';
import type { Review } from '@/types/api';

interface ReviewSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  initialLimit?: number;
}

export default function ReviewSection({
  reviews,
  averageRating,
  totalReviews,
  initialLimit = 6,
}: ReviewSectionProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit);

  const displayedReviews = reviews.slice(0, displayLimit);
  const hasMore = displayLimit < reviews.length;

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + 6);
  };

  return (
    <section className='py-8'>
      {/* Section Header */}
      <div className='mb-6'>
        <h2 className='display-sm md:display-md font-extrabold text-neutral-900'>
          Review
        </h2>
        <div className='mt-2 flex items-center gap-2'>
          <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
          <span className='text-md-custom font-bold text-neutral-900'>
            {averageRating.toFixed(1)}
          </span>
          <span className='text-md-custom text-neutral-600'>
            ({totalReviews} Ulasan)
          </span>
        </div>
      </div>

      {/* Reviews Grid */}
      {displayedReviews.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className='rounded-xl bg-neutral-50 py-12 text-center'>
          <p className='text-md-custom text-neutral-500'>No reviews yet</p>
        </div>
      )}

      {/* Show More Button */}
      {hasMore && (
        <div className='mt-8 flex justify-center'>
          <Button
            variant='outline'
            onClick={handleShowMore}
            className='rounded-full px-8'
          >
            Show More
          </Button>
        </div>
      )}
    </section>
  );
}
