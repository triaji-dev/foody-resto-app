'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';
import { ROUTES } from '@/constants';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSignInButtonStyles, getSignUpButtonStyles } from './navbar/utils';

import MobileMenu from './navbar/mobile-menu';
import DesktopMenu from './navbar/desktop-menu';
import { CartIcons } from './navbar/cart-icons';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    router.push(ROUTES.AUTH_LOGIN);
  };

  const handleSignUp = () => {
    router.push(ROUTES.AUTH_REGISTER);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'border-b border-white/20 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-b-0 bg-transparent'
      )}
    >
      <div
        className={cn(
          'flex-between w-full flex-row p-4 transition-all duration-300',
          isScrolled ? 'text-foreground' : 'text-white'
        )}
      >
        <Link
          href={ROUTES.HOME}
          className='group flex items-center gap-2 font-bold no-underline'
        >
          <div className='flex items-center gap-4 font-bold transition-transform group-hover:scale-105'>
            <Image
              src='/icons/logo-foody.svg'
              alt='Foody Logo'
              width={44}
              height={44}
              className='h-11 w-11 transition-all duration-300'
              style={{
                filter: isScrolled
                  ? 'brightness(0) saturate(100%) invert(18%) sepia(97%) saturate(4456%) hue-rotate(354deg) brightness(95%) contrast(94%)'
                  : 'none',
              }}
            />
            <span className='display-md-extrabold'>Foody</span>
          </div>
        </Link>

        <div className='flex flex-row items-center gap-3'>
          {isAuthenticated ? (
            // Authenticated state - Desktop dropdown menu
            <>
              <CartIcons isScrolled={isScrolled} />
              <DesktopMenu isScrolled={isScrolled} />
            </>
          ) : (
            // Logged out state - Sign In and Sign Up buttons (Desktop only)
            <div className='hidden items-center gap-3 md:flex'>
              <button
                onClick={handleSignIn}
                className={cn(
                  buttonVariants({ variant: 'default' }), // basic shape from shadcn
                  'transition-all duration-200 hover:scale-105 active:scale-95',
                  getSignInButtonStyles(isScrolled)
                )}
              >
                Sign In
              </button>

              <button
                onClick={handleSignUp}
                className={cn(
                  buttonVariants({ variant: 'default' }), // basic shape from shadcn
                  'transition-all duration-200 hover:scale-105 active:scale-95',
                  getSignUpButtonStyles(isScrolled)
                )}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <MobileMenu isScrolled={isScrolled} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
