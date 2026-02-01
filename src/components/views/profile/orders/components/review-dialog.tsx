'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateReview } from '@/features/reviews/review.queries';
import { Order } from '@/types/api';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function ReviewDialog({ open, onOpenChange, order }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const createReview = useCreateReview();

  const handleSubmit = () => {
    if (!order || rating === 0) return;

    createReview.mutate(
      {
        transactionId: order.transactionId,
        restaurantId: order.restaurantId,
        star: rating,
        comment: comment,
        menuIds: order.items.map((item) => item.menuId!), // Assuming menuId exists
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setRating(0);
          setComment('');
        },
      }
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    setRating(0);
    setComment('');
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md overflow-hidden rounded-2xl bg-white p-0'>
        <div className='p-6'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-xl font-bold'>Give Review</DialogTitle>
          </div>

          <div className='mt-8 flex flex-col items-center text-center'>
            <h3 className='mb-4 text-base font-bold'>Give Rating</h3>

            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className='transition-transform hover:scale-110 focus:outline-hidden'
                >
                  <Star
                    className={cn(
                      'h-10 w-10 fill-current transition-colors',
                      star <= (hoveredRating || rating)
                        ? 'text-orange-400'
                        : 'text-neutral-200'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className='mt-8 space-y-4'>
            <Textarea
              placeholder='Please share your thoughts about our service!'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='focus-visible:ring-primary min-h-[150px] resize-none rounded-xl border-neutral-200 p-4 text-sm'
            />

            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || createReview.isPending}
              className='w-full rounded-full bg-[#c12116] py-6 text-base font-bold text-white hover:bg-[#a11b12] disabled:bg-neutral-200 disabled:text-neutral-400'
            >
              {createReview.isPending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
