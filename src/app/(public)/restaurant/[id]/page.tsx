import RestaurantDetailPage from '@/components/views/restaurant-detail/restaurant-detail-page';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);

  if (isNaN(restaurantId)) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='display-md font-extrabold text-neutral-900'>
            Invalid Restaurant ID
          </h1>
          <p className='text-md-custom mt-2 text-neutral-600'>
            Please provide a valid restaurant ID.
          </p>
        </div>
      </div>
    );
  }

  return <RestaurantDetailPage restaurantId={restaurantId} />;
}
