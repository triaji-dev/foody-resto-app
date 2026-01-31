import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isScrolled?: boolean;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
}: AvatarProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} overflow-hidden rounded-full shadow-sm ring-2 ring-white/20 ${className}`}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className='h-full w-full object-cover'
          onError={handleError}
        />
      )}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-400 to-gray-600 ${src ? 'hidden' : 'flex'}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        <User className={`${iconSizes[size]} text-white drop-shadow-sm`} />
      </div>
    </div>
  );
};

// Generate initials dari nama user
export const getInitials = (name?: string) => {
  if (!name) return 'U';

  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Avatar dengan initials fallback
export const AvatarWithInitials = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  isScrolled = false,
}: AvatarProps & { name?: string }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs-custom',
    md: 'h-10 w-10 text-sm-custom',
    lg: 'h-12 w-12 text-lg-custom',
  };

  const initials = getInitials(name);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} overflow-hidden rounded-full border-2 border-white/20 ${className}`}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className='h-full w-full object-cover'
          onError={handleError}
        />
      )}
      <div
        className={`bg-neutral-500/20 ${isScrolled ? 'text-foreground' : 'text-white'} absolute inset-0 flex items-center justify-center font-semibold backdrop-blur-sm ${src ? 'hidden' : 'flex'}`}
      >
        {initials}
      </div>
    </div>
  );
};
