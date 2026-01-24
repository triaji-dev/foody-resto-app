import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingSpinner({
  className,
  size = 'md',
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={cn(
        'border-primary animate-spin rounded-full border-t-transparent',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className='sr-only'>Loading...</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className='flex min-h-[400px] w-full items-center justify-center p-8'>
      <LoadingSpinner size='lg' />
    </div>
  );
}
