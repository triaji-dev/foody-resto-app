'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Review } from '@/types/api';

interface ReviewCardProps {
  review: Review;
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) +
    ', ' +
    date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user?.name || review.userName || 'Anonymous';
  const userAvatar = review.userAvatar || review.user?.avatar;

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-5'>
      {/* Header: Avatar, Name, Date */}
      <div className='flex items-center gap-3'>
        <div className='relative h-10 w-10 overflow-hidden rounded-full bg-neutral-200 md:h-12 md:w-12'>
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              fill
              className='object-cover'
            />
          ) : (
            <div className='text-sm-custom flex h-full w-full items-center justify-center bg-neutral-300 font-bold text-neutral-600'>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className='flex flex-col'>
          <span className='text-sm-custom md:text-md-custom font-bold text-neutral-900'>
            {userName}
          </span>
          <span className='text-xs-custom text-neutral-500'>
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>

      {/* Star Rating */}
      <div className='flex items-center gap-0.5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < review.star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      {review.comment && (
        <p className='text-sm-custom leading-relaxed text-neutral-700'>
          {review.comment}
        </p>
      )}
    </div>
  );
}
